import { SUPPORTED_CHAINS_BY_NAME } from '../constants'

export function getExplorerLink(chainId, hash) {
  switch (chainId) {
    case SUPPORTED_CHAINS_BY_NAME.MAINNET:
      return `https://etherscan.io/tx/${hash}`
    case SUPPORTED_CHAINS_BY_NAME.XDAI:
      return `https://blockscout.com/xdai/mainnet/tx/${hash}`
    default:
      return `https://etherscan.io/tx/${hash}`
  }
}
