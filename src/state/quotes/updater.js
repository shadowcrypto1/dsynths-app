import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useMarketState } from '../market/hooks'
import { fetchQuotes } from './reducer'

export default function Updater() {
  const { networkName } = useMarketState()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchQuotes(networkName))
  }, [dispatch, networkName])

  return null
}
