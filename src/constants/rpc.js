import { SUPPORTED_CHAINS_BY_NAME } from './index'

export const RpcParams = {
  [SUPPORTED_CHAINS_BY_NAME.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://mainnet.infura.io/v3/undefined'],
    blockExplorerUrls: ['https://etherscan.io/'],
    iconUrls: []
  },
  [SUPPORTED_CHAINS_BY_NAME.XDAI]: {
    chainId: '0x64',
    chainName: 'xDAI Chain',
    nativeCurrency: {
      name: 'xDAI',
      symbol: 'xDAI',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.xdaichain.com/'],
    blockExplorerUrls: ['https://blockscout.com/poa/xdai/'],
    iconUrls: []
  },
}
