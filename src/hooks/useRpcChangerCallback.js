import { useCallback } from 'react'
// import { useWeb3React } from '@web3-react/core'
import { useWeb3React } from './useWeb3'

import { useMarketState } from '../state/market/hooks'
import { SUPPORTED_CHAINS_BY_NAME } from '../constants'
import { RpcParams } from '../constants/rpc'

export const useRpcChangerCallback = () => {
  const { chainId } = useWeb3React()
  const { networkName: fallbackNetworkName } = useMarketState()

  return useCallback(async (networkName) => {
    if (!chainId || !window.ethereum) return

    const targetChainId = SUPPORTED_CHAINS_BY_NAME[networkName || fallbackNetworkName]
    if (!targetChainId || !RpcParams[targetChainId]) return
    if (targetChainId === chainId) return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: RpcParams[targetChainId].chainId }],
      })
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          return await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [RpcParams[targetChainId]],
          })
        } catch (addError) {
          console.log('Something went wrong trying to add a new  network RPC: ')
          return console.error(addError)
        }
      }
      // handle other "switch" errors
      console.log('Unknown error occured when trying to change the network RPC: ')
      console.error(switchError)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, fallbackNetworkName])
}
