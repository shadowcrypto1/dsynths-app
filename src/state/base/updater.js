import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import _ from 'lodash'

import { useMarketState } from '../market/hooks'
import { updateStatus, updateSymbol, updateQuote, noQuote } from './actions'
import { useConductedState } from '../conducted/hooks'
import { useDetailsState } from '../details/hooks'
import { useQuotesState } from '../quotes/hooks'

export default function Updater() {
  const { baseSymbol, networkName, type } = useMarketState()
  const quote = useQuotesState()
  const conducted = useConductedState()
  const details = useDetailsState()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!baseSymbol) return

    const status = getFetchedStatus(conducted, details)
    if (status !== 'OK') {
      // console.log('Conducted and/or details are NOT OK')
      dispatch(updateStatus({ status }))
      return
    }

    const [ conductedValue, detailedValue ] = [
      findInConducted(conducted, networkName, baseSymbol),
      findInDetails(details, baseSymbol),
    ]

    if (!conductedValue || !detailedValue) {
      // console.log(`Unable to find baseSymbol ${baseSymbol} in the conducted/detailed registry`)
      dispatch(updateStatus({ status: 'NOT_FOUND' }))
      return
    }

    // console.log(`Found ${baseSymbol} in the conducted/detailed registry`)
    dispatch(updateSymbol({
      symbol: baseSymbol,
      name: detailedValue?.name,
      assetType: type,
      longSymbol: detailedValue?.long_symbol,
      longContract: conductedValue?.long,
      longDecimals: 18,
      longIsToken: true,
      shortSymbol: detailedValue?.short_symbol,
      shortContract: conductedValue?.short,
      shortDecimals: 18,
      shortIsToken: true,
    }))
  }, [dispatch, baseSymbol, conducted, details, networkName])

  useEffect(() => {
    if (!baseSymbol) return
    if (quote.status !== 'OK') {
      // console.log('Quote status is NOT OK');
      dispatch(noQuote())
      return
    }

    const foundQuote = findInQuote(quote, networkName, baseSymbol)
    if (!foundQuote || !foundQuote?.long || !foundQuote?.short) {
      // console.log(`Unable to get a quote for ${baseSymbol}`)
      dispatch(noQuote())
      return
    }

    // console.log(`Found ${baseSymbol} in the quote registry`)
    dispatch(
      updateQuote({
        longPrice: foundQuote.long.price,
        longFee: foundQuote.long.fee ,
        longIsClosed: !!foundQuote.long.is_close ,
        shortPrice: foundQuote.short.price,
        shortFee: foundQuote.short.fee,
        shortIsClosed: !!foundQuote.short.is_close,
      })
    )
  }, [dispatch, baseSymbol, quote, networkName])

  return null
}

function findInConducted(conducted, networkName, symbol) {
  const index = _.findIndex(conducted.data[symbol], { networkName: networkName.toUpperCase()})
  return index == -1
    ? null
    : conducted.data[symbol][index]
}

function findInDetails(details, symbol) {
  return details.data[symbol]
}

function findInQuote(quote, networkName, symbol) {
  const index = _.findIndex(quote.data[symbol], { networkName: networkName.toUpperCase()})
  return index == -1
    ? null
    : quote.data[symbol][index]
}

function getFetchedStatus(conducted, details) {
  const statusMapping = [ conducted.status, details.status ]
  return statusMapping.reduce((acc, status) => {
    if (status === 'OK') return acc
    acc = status
    return acc
  }, 'OK')
}
