// Research this:
// https://github.com/Uniswap/uniswap-interface/blob/5ff2cff841f890e645a7cd29c89f19fe13e65f51/src/utils/calculateGasMargin.ts

// Common ABI's
export { default as syncMainnet } from './mainnet'
export { default as syncBSC } from './mainnet'
export { default as syncHECO } from './mainnet'
export { default as syncPolygon } from './mainnet'

// Deviating ABI's
export { default as syncXDAI } from './xdai'
