import { SUPPORTED_CHAINS_BY_NAME } from '../constants'

/**
 * Returns the input chain ID if chain is supported. If not, return undefined
 * @param chainId a chain ID, which will be returned if it is a supported chain ID
 */
export function supportedChainId(chainId) {
  if (chainId in SUPPORTED_CHAINS_BY_NAME) {
    return chainId
  }
  return undefined
}
