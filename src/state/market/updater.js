import { useEffect } from 'react'
// import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import { useWeb3React } from '../../hooks/useWeb3'
import { replaceMarketState } from './actions'
import { SUPPORTED_PAIRS_BY_CHAIN_ID, SUPPORTED_CHAINS_BY_NAME } from '../../constants'

const Field = {
  BASE: 'BASE',
  PAIR: 'PAIR',
  NETWORK: 'NETWORK',
}

export default function Updater() {
  const { chainId } = useWeb3React()
  const dispatch = useDispatch()
  const { query } = useRouter()

  useEffect(() => {
    const parsed = queryParametersToMarketState(query, chainId)

    dispatch(
      replaceMarketState({
        baseSymbol: parsed[Field.BASE].baseSymbol,
        pairSymbol: parsed[Field.PAIR].pairSymbol,
        networkName: parsed[Field.NETWORK].networkName,
      })
    )
  }, [dispatch, chainId, query])

  return null
}

function queryParametersToMarketState(parsedQs) {
  let networkName = parseNetworkName(parsedQs?.network)
  let baseSymbol = parseBaseCurrency(parsedQs?.symbol)
  let pairSymbol = parsePairCurrency(networkName)

  return {
    [Field.BASE]: {
      baseSymbol: baseSymbol,
    },
    [Field.PAIR]: {
      pairSymbol: pairSymbol,
    },
    [Field.NETWORK]: {
      networkName: networkName,
    },
  }
}

function parseBaseCurrency(urlParam) {
  if (typeof urlParam === 'string') {
    return urlParam.toUpperCase()
  }
  return 'GME'
}

export function parsePairCurrency(fallbackNetworkName) {
  const chainIdByNetworkName = SUPPORTED_CHAINS_BY_NAME[fallbackNetworkName]
  return SUPPORTED_PAIRS_BY_CHAIN_ID[chainIdByNetworkName][0]
}

function parseNetworkName(urlParam) {
  if (typeof urlParam === 'string') {
    let name = urlParam === 'ETH' ? 'MAINNET' : urlParam.toUpperCase()
    if (SUPPORTED_CHAINS_BY_NAME[name]) {
      return name
    }
  }
  return 'XDAI'
}
