import { useMemo } from 'react'
// import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { isAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import { AddressZero } from '@ethersproject/constants'
import Web3 from 'web3'

import { useWeb3React } from './useWeb3'
import { SYNCHRONIZER_ADDRESSES_BY_CHAIN_ID, SYNCHRONIZER_ABI_BY_CHAIN_ID } from '../constants'
import ERC20ABI from '../constants/abi/ERC20ABI.json'

export const useContract = (address, ABI, withSignerIfPossible = true) => {
  const { library, account, chainId } = useWeb3React()
  return useMemo(() => {
    try {
      if (!address || !ABI || !library || !chainId || !account) return null
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (err) {
      console.error('Failed to get contract: ', err)
      return null
    }
  }, [address, library, chainId, ABI, withSignerIfPossible, account])
}

export const useTokenContract = (tokenAddress, withSignerIfPossible) => {
  return useContract(tokenAddress, ERC20ABI, withSignerIfPossible)
}

export const useAMMContract = () => {
  const { library, account, chainId } = useWeb3React()
  return useMemo(() => {
    try {
      const address = SYNCHRONIZER_ADDRESSES_BY_CHAIN_ID[chainId]
      const abi = SYNCHRONIZER_ABI_BY_CHAIN_ID[chainId]
      if (!library || !chainId || !account || !address || !abi) return null

      const Provider = new Web3(Web3.givenProvider)
      return new Provider.eth.Contract(abi, address)
    } catch (err) {
      console.error('Failed to get contract: ', err)
      return null
    }
  }, [library, chainId, account])
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library
}

export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked()
}

const getContract = (address, ABI, library, account) => {
  if (!isAddress(address) || address === AddressZero) {
    throw new Error(`Invalid 'address' parameter '${address}'.`)
  }
  return new Contract(address, ABI, getProviderOrSigner(library, account))
}
