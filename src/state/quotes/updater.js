import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useMarketState } from '../market/hooks'
import { fetchQuotes } from './reducer'

export default function Updater() {
  const { networkName } = useMarketState()
  const dispatch = useDispatch()

  useEffect(() => {
    const self = setInterval(() => {
      dispatch(fetchQuotes(networkName))
    }, [30 * 1000])
    dispatch(fetchQuotes(networkName))

    return (() => clearInterval(self))
  }, [dispatch, networkName])

  return null
}
