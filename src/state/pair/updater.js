import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { useMarketState } from '../market/hooks'
import { updatePair } from './actions'

import { PAIR_INFO_BY_CHAIN_ID, SUPPORTED_CHAINS_BY_NAME } from '../../constants'

export default function Updater() {
  const { pairSymbol, networkName } = useMarketState()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!pairSymbol || !networkName) return
    const chainIdByNetworkName = SUPPORTED_CHAINS_BY_NAME[networkName]
    dispatch(updatePair(
      PAIR_INFO_BY_CHAIN_ID[chainIdByNetworkName][pairSymbol.toUpperCase()]
    ))
  }, [dispatch, pairSymbol, networkName])

  return null
}
