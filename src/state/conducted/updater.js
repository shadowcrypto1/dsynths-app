import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useMarketState } from '../market/hooks'
import { fetchConducted } from './reducer'

export default function Updater() {
  const { networkName } = useMarketState()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchConducted(networkName))
  }, [dispatch, networkName])

  return null
}
