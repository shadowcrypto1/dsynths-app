import { useEffect, useMemo } from 'react'
import { useSelect } from 'react-select-search/dist/cjs'
import Fuse from 'fuse.js'
import _ from 'lodash'
import { useRouter } from 'next/router'

import { useFavorites } from '../state/favorites/hooks'
import { useBaseState } from '../state/base/hooks'
import { useConductedState } from '../state/conducted/hooks'
import { useDetailsState } from '../state/details/hooks'

// This order makes sure that stocks/commodities will ALWAYS be above crypto
const groupsOrder = ['STOCKS / COMMODITIES', 'CRYPTO']

export const useSearchList = () => {
  const router = useRouter()
  const conducted = useConductedState()
  const details = useDetailsState()
  const base = useBaseState()
  const favorites = useFavorites()

  const options = useMemo(() => {
    if (!details || details.status != 'OK') return []
    if (!networkName) return []

    const groups = Object.entries(conducted.data).reduce((acc, keyValue) => {
      const [symbol, values] = keyValue
      const props = details.data[symbol]
      const sector = parseSectorName(props.sector)

      if (!acc[sector]) {
        acc[sector] = {
          type: 'group',
          name: sector,
          items: [],
        }
      }

      acc[sector].items.push({
        name: props.name,
        value: props.symbol, // using `value` and not `symbol` because snapshot takes in a 'value' param
        favorite: favorites.includes(props.name),
        networks: values.map((o) => o.networkName),
      })
      return acc
    }, {})

    let result = Object.values(groups).map((group) => {
      return {
        ...group,
        items: group.items
          .filter((asset) => (networkName === 'ALL' ? true : asset.networks.includes(networkName)))
          .sort((a, b) => a.value.localeCompare(b.value))
          .sort((a, b) => (a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1)),
      }
    })

    // Order display groups
    return _.sortBy(result, (obj) => {
      return _.indexOf(groupsOrder, obj.name)
    })
  }, [conducted, details, favorites, networkName])

  const [snapshot, searchProps, optionProps] = useSelect({
    options,
    value: base.symbol,
    search: true,
    filterOptions: fuzzySearch,
    allowEmpty: true,
    closeOnSelect: false,
  })

  useEffect(() => {
    const symbol = snapshot.value

    if (!symbol) return // initial render is null, if not filtered it will cause performance issues
    if (base?.symbol.toUpperCase() === symbol?.toUpperCase()) return

    // Dispatch changes by altering the url, this won't cause a re-render/reload, but will be picked up by URLParsing listeners
    router.push({ query: { symbol: symbol } })
  }, [snapshot.value, router, base?.symbol])

  return [snapshot, optionProps, searchProps]
}

function parseSectorName(sector) {
  switch (sector.toUpperCase()) {
    case 'STOCK' || 'XDAI-STOCK':
      return 'STOCKS / COMMODITIES'
    case 'XDAI-CRYPTO':
      return 'CRYPTO'
    default:
      return 'STOCKS / COMMODITIES'
  }
}

function fuzzySearch(options) {
  const mergedOptions = [].concat.apply(
    [],
    options.map((group) => {
      return group.items.map((item) => {
        return {
          ...item,
          groupId: group.name,
        }
      })
    })
  )
  const fuse = new Fuse(mergedOptions, {
    keys: ['name', 'value'],
    threshold: 0.2,
  })

  return (value) => {
    if (!value.length) {
      return options
    }
    const result = fuse.search(value)
    const groups = result.reduce((acc, item) => {
      if (!acc[item.groupId]) {
        acc[item.groupId] = {
          type: 'group',
          name: item.groupId,
          items: [],
        }
      }
      acc[item.groupId].items.push(item)
      return acc
    }, {})
    return Object.values(groups)
  }
}
