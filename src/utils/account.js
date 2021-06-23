import { getAddress } from '@ethersproject/address'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value) {
	try {
		return getAddress(value)
	} catch {
		return false
	}
}

export function truncateAddress(address, chars = 4) {
	const parsed = isAddress(address)
	if (!parsed) {
		throw Error(`Invalid 'address' parameter '${address}'.`)
	}
	return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}
