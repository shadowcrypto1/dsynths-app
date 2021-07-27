import { deusV1Client	 } from './client'
import {
	TRANSACTIONS_MARKET,
	TRANSACTIONS_ACCOUNT,
	REGISTRARS,
	ALL_REGISTRARS,
} from './queries'

export const getTransactions = async (symbolMapping, maxResults) => {
	try {
		let result = await deusV1Client.query({
			query: TRANSACTIONS_MARKET,
			variables: {
				symbol: symbolMapping,
				maxResults: maxResults || 100,
			},
			fetchPolicy: 'no-cache',
		})
		return result.data.transactions
	} catch (e) {
		console.error(e)
		return []
	}
}

export const getTransactionsForAccount = async (account, symbolMapping, maxResults) => {
	try {
		let result = await deusV1Client.query({
			query: TRANSACTIONS_ACCOUNT,
			variables: {
				symbol: symbolMapping,
				account: account,
				maxResults: maxResults || 100,
			},
			fetchPolicy: 'no-cache',
		})
		return result.data.transactions
	} catch (e) {
		console.error(e)
		return []
	}
}

export const getRegistrars = async (symbolMapping) => {
	try {
		let result = await deusV1Client.query({
			query: REGISTRARS,
			variables: {
				symbol: symbolMapping,
			},
			fetchPolicy: 'no-cache',
		})
		return result.data.registrars
	} catch (e) {
		console.error(e)
		return []
	}
}

export const getTopRegistrars = async (maxResults) => {
	try {
		let result = await deusV1Client.query({
			query: ALL_REGISTRARS,
			variables: {
				maxResults: maxResults || 20,
			},
			fetchPolicy: 'no-cache',
		})
		return result.data.registrars
	} catch (e) {
		console.error(e)
		return []
	}
}
