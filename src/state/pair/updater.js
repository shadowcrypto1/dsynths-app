import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'

import { useMarketState } from '../market/hooks'
import { updatePair } from './actions'
import { parsePairCurrency } from '../market/updater'

import { PAIR_INFO_BY_CHAIN_ID, SUPPORTED_CHAINS_BY_NAME } from '../../constants'

export default function Updater() {
  const { pairSymbol, networkName } = useMarketState()
  const dispatch = useDispatch()
  const { chainId } = useWeb3React()

  useEffect(() => {
    if (!pairSymbol || !chainId) return
    const chainIdByNetworkName = SUPPORTED_CHAINS_BY_NAME[networkName]
    dispatch(updatePair(
      PAIR_INFO_BY_CHAIN_ID[chainIdByNetworkName][pairSymbol.toUpperCase()]
    ))
  }, [dispatch, pairSymbol, chainId, networkName])

  return null
}
