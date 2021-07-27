import React, { useMemo } from 'react'
// import { useWeb3React } from '@web3-react/core'
import { isAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import { AddressZero } from '@ethersproject/constants'
import Web3 from 'web3'
import { useActiveWeb3React } from './useWeb3'

import { SYNCHRONIZER_ADDRESSES_BY_CHAIN_ID } from '../constants'
import ERC20ABI from '../constants/abi/ERC20ABI.json'
import AMMABI from '../constants/abi/AMMABI.json'
import wxDAIABI from '../constants/abi/wxDAIABI.json'

export const useContract = (address, ABI, withSignerIfPossible = true) => {
  const { library, account, chainId } = useActiveWeb3React()
  return useMemo(() => {
    try {
      if (!address || !ABI || !library || !chainId || !account) return null
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (err) {
      console.error('Failed to get contract: ', err)
      return null
    }
  }, [address, library, chainId])
}

export const useTokenContract = (tokenAddress, withSignerIfPossible) => {
  return useContract(tokenAddress, ERC20ABI, withSignerIfPossible)
}

export const useAMMContract = () => {
  const { chainId } = useActiveWeb3React()
  const address = SYNCHRONIZER_ADDRESSES_BY_CHAIN_ID[chainId]
  return useContract(address, AMMABI)
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
