import { SUPPORTED_CHAINS_BY_NAME } from '../constants'

export function getExplorerLink(chainId, hash) {
  switch (chainId) {
    case SUPPORTED_CHAINS_BY_NAME.MAINNET:
      return `https://etherscan.io/tx/${hash}`
    case SUPPORTED_CHAINS_BY_NAME.BSC:
      return `https://bscscan.com/tx/${hash}`
    case SUPPORTED_CHAINS_BY_NAME.HECO:
      return `https://hecoinfo.com/tx/${hash}`
    case SUPPORTED_CHAINS_BY_NAME.POLYGON:
      return `https://polygonscan.com/tx/${hash}`
    case SUPPORTED_CHAINS_BY_NAME.XDAI:
      return `https://blockscout.com/xdai/mainnet/tx/${hash}`
    default:
      console.error(`Unable to select an explorerLink for chainId: ${chainId}`);
      return `https://etherscan.io/tx/${hash}`
  }
}
