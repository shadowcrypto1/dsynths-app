import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

import { NetworkConnector } from './NetworkConnector'
import { SUPPORTED_CHAINS_BY_NAME, SUPPORTED_CHAIN_IDS } from '../constants'

const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY
const WALLETCONNECT_BRIDGE_URL = process.env.NEXT_PUBLIC_WALLETCONNECT_BRIDGE_URL

if (!INFURA_KEY || typeof INFURA_KEY === 'undefined') {
  throw new Error('NEXT_PUBLIC_INFURA_KEY must be a defined environment variable')
}

if (!WALLETCONNECT_BRIDGE_URL || typeof WALLETCONNECT_BRIDGE_URL === 'undefined') {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_BRIDGE_URL must be a defined environment variable')
}

const NETWORK_URLS = {
  [SUPPORTED_CHAINS_BY_NAME.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [SUPPORTED_CHAINS_BY_NAME.XDAI]: 'https://rpc.xdaichain.com',
}

export const network = new NetworkConnector({
  urls: NETWORK_URLS,
  defaultChainId: 1,
})

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: NETWORK_URLS,
  bridge: WALLETCONNECT_BRIDGE_URL,
  qrcode: true,
  pollingInterval: 15000,
})

export const ConnectorNames = {
  Injected: 'MetaMask',
  WalletConnect: 'WalletConnect',
}

export const connectorsByName = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
}
