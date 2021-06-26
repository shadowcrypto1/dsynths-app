import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { isAddress } from "@ethersproject/address"

import { useWeb3 } from "./useWeb3"
import { useERC20 } from './useContract'

export function useTokenBalance (tokenAddress) {
  const { account, library } = useWeb3React()
  const [balance, setBalance] = useState(0)
  const web3 = useWeb3()
  const contract = useERC20(tokenAddress)

  useEffect(() => {
    const fetchBalance = async () => {
      let walletBalance = 0
      if (!isAddress(tokenAddress)) {
        // walletBalance = await web3.eth.getBalance(account)
      } else {
        // walletBalance = await contract.methods.balanceOf(account).call()
      }
      setBalance(walletBalance)
    }

    account && fetchBalance()
  }, [account, tokenAddress, web3, contract])
  return balance
}
