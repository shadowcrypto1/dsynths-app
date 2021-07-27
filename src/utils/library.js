import { Web3Provider } from '@ethersproject/providers'

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
