import _ from 'lodash'

import AMM_ABI_ETH from './abi/AMM_ABI_ETH.json'
import AMM_ABI_BSC from './abi/AMM_ABI_BSC.json'
import AMM_ABI_HECO from './abi/AMM_ABI_HECO.json'
import AMM_ABI_XDAI from './abi/AMM_ABI_XDAI.json'
import AMM_ABI_POLYGON from './abi/AMM_ABI_POLYGON.json'

export const SYNCHRONIZER_ADDRESSES_BY_CHAIN_ID = {
  1: '0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3',
  56: '0x3b62f3820e0b035cc4ad602dece6d796bc325325',
  100: '0x89951F2546f36789072c72C94272a68970Eba65e', // wxDAI proxy
  128: '0xe82aa18b107aaf8D3829111C91CD0D133E0773DC',
  137: '0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3'
}

export const SYNCHRONIZER_ABI_BY_CHAIN_ID = {
  1: AMM_ABI_ETH,
  56: AMM_ABI_BSC,
  100: AMM_ABI_XDAI,
  128: AMM_ABI_HECO,
  137: AMM_ABI_POLYGON,
}

export const SUPPORTED_PAIRS_BY_CHAIN_ID = {
  1: ['DEI'],
  56: ['BUSD'],
  100: ['XDAI'],
  128: ['HUSD'],
  137: ['DEI'],
}

export const PAIR_INFO_BY_CHAIN_ID = {
  1: {
    DAI: {
      isToken: true,
      contract: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      decimals: 18,
      symbol: 'DAI',
    },
    DEI: {
      isToken: true,
      contract: '0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3',
      decimals: 18,
      symbol: 'DEI',
    },
  },
  56: {
    BUSD: {
      isToken: true,
      contract: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      decimals: 18,
      symbol: 'BUSD',
    }
  },
  100: {
    XDAI: {
      isToken: false,
      contract: '0x0000000000000000000000000000000000000001',
      decimals: 18,
      symbol: 'xDAI',
    }
  },
  128: {
    HUSD: {
      isToken: true,
      contract: '0x0298c2b32eae4da002a15f36fdf7615bea3da047',
      decimals: 8,
      symbol: 'HUSD',
    }
  },
  137: {
    USDC: {
      isToken: true,
      contract: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      decimals: 6,
      symbol: 'USDC',
    },
    DEI: {
      isToken: true,
      contract: '0xDE12c7959E1a72bbe8a5f7A1dc8f8EeF9Ab011B3',
      decimals: 18,
      symbol: 'DEI',
    }
  },
}

export const SUPPORTED_CHAINS_BY_NAME = {
  MAINNET: 1,
  BSC: 56,
  XDAI: 100,
  HECO: 128,
  POLYGON: 137,
}

export const SUPPORTED_CHAINS_AS_OPTIONS = [
  { name: 'Ethereum', short: 'ETH', value: 'MAINNET' },
  { name: 'BSC', short: 'BSC', value: 'BSC' },
  { name: 'xDAI', short: 'xDAI', value: 'XDAI' },
  { name: 'HECO', short: 'HECO', value: 'HECO' },
  { name: 'Polygon', short: 'POLYGON', value: 'POLYGON' },
]

export const SUPPORTED_CHAINS_BY_ID = _.invert(SUPPORTED_CHAINS_BY_NAME)
export const SUPPORTED_CHAIN_IDS = Object.values(SUPPORTED_CHAINS_BY_NAME)
