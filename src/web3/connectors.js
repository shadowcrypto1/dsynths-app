import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
const WALLETCONNECT_BRIDGE_URL = process.env.REACT_APP_WALLETCONNECT_BRIDGE_URL

if (!INFURA_KEY || typeof INFURA_KEY === 'undefined') {
	throw new Error('REACT_APP_INFURA_KEY must be a defined environment variable')
}

if (!WALLETCONNECT_BRIDGE_URL || typeof WALLETCONNECT_BRIDGE_URL === 'undefined') {
	throw new Error('REACT_APP_WALLETCONNECT_BRIDGE_URL must be a defined environment variable')
}

const ChainId = {
	MAINNET: 1,
	ROPSTEN: 3,
	RINKEBY: 4,
	KOVAN: 42
}

const NETWORK_URLS = {
	[ChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
	[ChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
	[ChainId.ROPSTEN]: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
	[ChainId.KOVAN]: `https://kovan.infura.io/v3/${INFURA_KEY}`,
}

export const supportedChainIds = [1, 3, 5, 42]
export const injected = new InjectedConnector({
	supportedChainIds: supportedChainIds,
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
	rpc: { 1: NETWORK_URLS[1] },
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
