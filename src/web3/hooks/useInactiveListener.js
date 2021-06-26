import React, { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'

import { injected } from '../connectors'

export function useInactiveListener(suppress = false) {
	const { active, error, activate } = useWeb3React()

	useEffect(() => {
		const { ethereum } = window
		if (ethereum && ethereum.on && !active && !error && !suppress) {
			const handleConnect = () => {
				console.log('Handling \'connect\' event')
				activate(injected).catch(error => {
					console.error('Failed to activate after connect event', error)
				})
			}
			const handleAccountsChanged = (accounts) => {
				console.log('Handling \'accountsChanged\' event with payload', accounts)
				if (accounts.length > 0) {
					activate(injected).catch(error => {
						console.error('Failed to activate after accounts changed', error)
					})
				}
			}
			// soon to be deprecated, but supported here for the meantime
			const handleNetworkChanged = (networkId) => {
				console.log('Handling \'networkChanged\' event with payload', networkId)
				activate(injected).catch(error => {
					console.error('Failed to activate after network change', error)
				})
			}
			// new API for handleNetworkChanged
			const handleChainChanged = (chainId) => {
				console.log('Handling \'chainChanged\' event with payload', chainId)
				activate(injected).catch(error => {
					console.error('Failed to activate after chain changed', error)
				})
			}

			ethereum.on('connect', handleConnect)
			ethereum.on('accountsChanged', handleAccountsChanged)
			ethereum.on('networkChanged', handleNetworkChanged)
			ethereum.on('chainChanged', handleChainChanged)

			return () => {
				if (ethereum.removeListener) {
					ethereum.removeListener('connect', handleConnect)
					ethereum.removeListener('chainChanged', handleChainChanged)
					ethereum.removeListener('accountsChanged', handleAccountsChanged)
					ethereum.removeListener('networkChanged', handleNetworkChanged)
				}
			}
		}
	}, [active, error, suppress, activate])
}
