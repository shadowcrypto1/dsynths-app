export const SYNCHRONIZER_ADDRESSES_BY_CHAIN_ID = {
  1: '0x7a27a7BF25d64FAa090404F94606c580ce8E1D37',
  100: '0xc2fB644cd18325C58889Cf8BB0573e4a8774BCD2', // default
  // 100: '0x89951F2546f36789072c72C94272a68970Eba65e', // proxy
}

export const SUPPORTED_PAIRS_BY_CHAIN_ID = {
  1: ['DAI'],
  100: ['XDAI'],
}

export const PAIR_INFO_BY_CHAIN_ID = {
  1: {
    DAI: {
      isToken: true,
      contract: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      decimals: 18,
      symbol: 'DAI',
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
}

export const SUPPORTED_CHAINS_BY_NAME = {
	MAINNET: 1,
  XDAI: 100,
}

export const SUPPORTED_CHAIN_IDS = Object.entries(SUPPORTED_CHAINS_BY_NAME).map(([key, value] = []) => value)
