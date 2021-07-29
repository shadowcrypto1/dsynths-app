import { Web3Provider, JsonRpcProvider } from '@ethersproject/providers'
import { getNetworkLibrary } from '../connectors'

export const getLibrary = (provider) => {
  const library = new Web3Provider(
    provider,
    typeof provider.chainId === 'number'
      ? provider.chainId
      : typeof provider.chainId === 'string'
      ? parseInt(provider.chainId)
      : 'any'
  )
  library.pollingInterval = 15000
  return library
}
