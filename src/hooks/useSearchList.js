import React, { useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelect } from 'react-select-search'
import Fuse from 'fuse.js'
import qs from 'query-string'

import { useFavorites } from '../state/favorites/hooks'
import { useBaseState } from '../state/base/hooks'
import { useConductedState } from '../state/conducted/hooks'
import { useDetailsState } from '../state/details/hooks'

export const useSearchList = () => {
  const { location, push } = useHistory()
  const conducted = useConductedState()
  const details = useDetailsState()
  const base = useBaseState()
  const favorites = useFavorites()

  const options = useMemo(() => {
    if (!details) return []
    const groups = conducted.data.reduce((acc, synth) => {
      const props = details.data[synth.id]
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
        value: props.symbol,
        favorite: favorites.includes(props.name),
      })
      return acc
    }, {})
    return Object.values(groups).map(group => {
      return {
        ...group,
        items: group.items
          .sort((a, b) => a.value.localeCompare(b.value))
          .sort((a, b) => (a.favorite === b.favorite)? 0 : a.favorite? -1 : 1)
      }
    })
  }, [conducted, details, favorites])

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

    const queryParams = qs.parse(location.search)
    const query = { ...queryParams, symbol: symbol }

    // Dispatch changes by altering the url, this won't cause a re-render/reload, but will be picked up by URLParsing listeners
    push({ search: qs.stringify(query)})

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot.value])

  return [
    snapshot,
    optionProps,
    searchProps,
  ]
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
  const groupNames = options.map(option => option.name)
  const mergedOptions = [].concat.apply([], options.map(group => {
    return group.items.map(item => {
      return {
        ...item,
        groupId: group.name
      }
    })
  }))
  const fuse = new Fuse(mergedOptions, {
    keys: [ 'name', 'value' ],
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
          items: []
        }
      }
      acc[item.groupId].items.push(item)
      return acc
    }, {})
    return Object.values(groups)
  }
}
