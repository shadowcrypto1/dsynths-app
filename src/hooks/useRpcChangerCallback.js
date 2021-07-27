import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import qs from 'query-string'

import { useMarketState } from '../state/market/hooks'
import { SUPPORTED_CHAINS_BY_NAME } from '../constants'
import { RpcParams } from '../constants/rpc'

export const useRpcChangerCallback = () => {
  const { account, chainId } = useWeb3React()
  const { location, push, replace } = useHistory()
  const { networkName: fallbackNetworkName } = useMarketState()

  const onSuccessCallback = (networkName) => {

    // Alter the current URL, but strip all params except for the networkName
    // const queryParams = qs.parse(location.search)
    // const query = { ...queryParams, network: networkName }
    const query = { network: networkName }

    // Dispatch changes by altering the url => following this is the useWeb3 instance refreshing the page
    replace({ search: qs.stringify(query)})
  }

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
      console.log('Successfully switched network RPC, proceeding to alter URL')
      onSuccessCallback(networkName)
    })
    .catch(err => {
      console.log('Something went wrong trying to change the network RPC: ')
      console.error(err)
    })
  }, [chainId, account])
}
