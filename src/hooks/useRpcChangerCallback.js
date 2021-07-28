import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useHistory } from 'react-router-dom'
import qs from 'query-string'

import { useMarketState } from '../state/market/hooks'
import { SUPPORTED_CHAINS_BY_NAME } from '../constants'
import { RpcParams } from '../constants/rpc'

export const useRpcChangerCallback = () => {
  const { account, chainId } = useWeb3React()
  const { replace } = useHistory()
  const { networkName: fallbackNetworkName } = useMarketState()

  return useCallback((networkName) => {
    if (!chainId || !account || !window.ethereum) return

    const targetChainId = SUPPORTED_CHAINS_BY_NAME[networkName || fallbackNetworkName]
    if (!targetChainId || !RpcParams[targetChainId]) return
    if (targetChainId === chainId) return

    window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: RpcParams[targetChainId].chainId }],
    })
    .then((result) => {
      console.log('Successfully switched network RPC')
    })
    .catch(err => {
      console.log('Something went wrong trying to change the network RPC: ')
      console.error(err)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, account, fallbackNetworkName])
}
