import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import _ from 'lodash'

import { useMarketState } from '../market/hooks'
import { updateStatus, updateSymbol, updateQuote, noQuote } from './actions'
import { useConductedState } from '../conducted/hooks'
import { useDetailsState } from '../details/hooks'
import { useQuotesState } from '../quotes/hooks'

export default function Updater() {
  const { baseSymbol, networkName } = useMarketState()
  const quote = useQuotesState()
  const conducted = useConductedState()
  const details = useDetailsState()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!baseSymbol) return

    const status = getFetchedStatus(conducted, details)
    if (status !== 'OK') {
      // console.log('Conducted and/or details are NOT OK');
      dispatch(updateStatus({ status }))
      return
    }

    const [ conductedValue, detailedValue ] = [
      findInConducted(conducted, baseSymbol),
      findInDetails(details, baseSymbol),
    ]
    if (!conductedValue || !detailedValue) {
      // console.log(`Unable to find baseSymbol ${baseSymbol} in the conducted/detailed registry`);
      dispatch(updateStatus({ status: 'NOT_FOUND' }))
      return
    }

    // console.log(`Found ${baseSymbol} in the conducted/detailed registry`)

    dispatch(updateSymbol({
      symbol: baseSymbol,
      name: detailedValue?.name,
      longSymbol: detailedValue?.long_symbol,
      longContract: conductedValue?.long,
      longDecimals: 18,
      longIsToken: true,
      shortSymbol: detailedValue?.short_symbol,
      shortContract: conductedValue?.short,
      shortDecimals: 18,
      shortIsToken: true,
    }))
  }, [dispatch, baseSymbol, conducted, details])

  useEffect(() => {
    if (!baseSymbol) return
    if (quote.status !== 'OK') {
      // console.log('Quote status is NOT OK');
      dispatch(noQuote())
      return
    }

    const foundQuote = findInQuote(quote, baseSymbol)
    if (!foundQuote) {
      console.log(`Unable to get a quote for ${baseSymbol}`);
      dispatch(noQuote())
      return
    }

    // console.log(`Found ${baseSymbol} in the quote registry`)
    const index = _.findIndex(foundQuote, { networkName: networkName.toUpperCase()})
    const assetQuote = foundQuote[index]
    const exists = index !== -1

    dispatch(
      updateQuote({
        longPrice: exists ? assetQuote.long.price : null,
        longFee: exists ? assetQuote.long.fee : null,
        longIsClosed: exists ? !!assetQuote.long.is_close : null,
        shortPrice: exists ? assetQuote.short.price : null,
        shortFee: exists ? assetQuote.short.fee : null,
        shortIsClosed: exists ? !!assetQuote.short.is_close : null,
      })
    )
  }, [dispatch, baseSymbol, quote, networkName])

  return null
}

function findInConducted(conducted, symbol) {
  return conducted.data[symbol]
}

function findInDetails(details, symbol) {
  return details.data[symbol]
}

function findInQuote(quote, symbol) {
  return quote.data[symbol]
}

function getFetchedStatus(conducted, details) {
  const statusMapping = [ conducted.status, details.status ]
  return statusMapping.reduce((acc, status) => {
    if (status === 'OK') return acc
    acc = status
    return acc
  }, 'OK')
}
