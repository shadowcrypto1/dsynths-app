import { useCallback } from 'react'
// import { useWeb3React } from '@web3-react/core'
import { useWeb3React } from './useWeb3'

import { useMarketState } from '../state/market/hooks'
import { SUPPORTED_CHAINS_BY_NAME } from '../constants'
import { RpcParams } from '../constants/rpc'

export const useRpcChangerCallback = () => {
  const { chainId } = useWeb3React()
  const { networkName: fallbackNetworkName } = useMarketState()

  return useCallback((networkName) => {
    if (!chainId || !window.ethereum) return

    const targetChainId = SUPPORTED_CHAINS_BY_NAME[networkName || fallbackNetworkName]
    if (!targetChainId || !RpcParams[targetChainId]) return
    if (targetChainId === chainId) return

    window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: RpcParams[targetChainId].chainId }],
    })
      .then(() => {
        console.log('Successfully switched network RPC')
      })
      .catch(err => {
        console.log('Something went wrong trying to change the network RPC: ')
        console.error(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, fallbackNetworkName])
}
