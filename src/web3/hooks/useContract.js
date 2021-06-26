import React, { useMemo } from 'react'
import { isAddress } from '@ethersproject/address'
import { useWeb3React } from '@web3-react/core'

import { useWeb3 } from './useWeb3'
import { getERC20Contract } from '../utils/contract'

export function useERC20 (address) {
  const web3 = useWeb3()
  return useMemo(() => {
    if (!isAddress(address)) return null
    return getERC20Contract(address, web3)
  }, [address, web3])
}
