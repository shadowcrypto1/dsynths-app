import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { isAddress } from "@ethersproject/address"
import { BigNumber } from '@ethersproject/bignumber'

import { useTokenContract } from './useContract'

export const useTokenBalance = (tokenAddress, isToken) => {
  const { account, library } = useWeb3React()
  const [ balance, setBalance ] = useState(BigNumber.from('0'))
  const contract = useTokenContract(tokenAddress)

  useEffect(() => {
    let mounted = true
    const fetchBalance = async () => {
      try {
        let walletBalance = null
        if (isToken) {
          walletBalance = await contract.balanceOf(account)
        } else {
          walletBalance = await library.getBalance(account)
        }
        mounted && setBalance(walletBalance)
      } catch (err) {
        console.error(err)
        mounted && setBalance(BigNumber.from('0'))
      }
    }

    if (account && library && contract) {
      fetchBalance()
    } else {
      mounted && setBalance(BigNumber.from('0'))
    }

    return () => mounted = false
  }, [account, library, contract])

  return balance
}
