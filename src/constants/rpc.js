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
  },
  [SUPPORTED_CHAINS_BY_NAME.BSC]: {
    chainId: "0x38",
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed1.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
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
  },
  [SUPPORTED_CHAINS_BY_NAME.HECO]: {
    chainId: "0x80",
    chainName: "Huobi ECO Chain Mainnet",
    nativeCurrency: {
      name: "HT",
      symbol: "HT",
      decimals: 18,
    },
    rpcUrls: ["https://http-mainnet.hecochain.com"],
    blockExplorerUrls: ["https://hecoinfo.com"],
  },
  [SUPPORTED_CHAINS_BY_NAME.POLYGON]: {
    chainId: "0x89",
    chainName: "Matic Mainnet",
    nativeCurrency: {
      name: "Matic",
      symbol: "Matic",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mainnet.matic.quiknode.pro", "https://matic-mainnet.chainstacklabs.com", "https://rpc-mainnet.matic.network", "https://rpc-mainnet.maticvigil.com", "https://matic-mainnet-full-rpc.bwarelabs.com", "https://matic-mainnet-archive-rpc.bwarelabs.com"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
}
