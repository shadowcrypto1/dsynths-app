import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from '@ethersproject/bignumber'
import { isAddress } from '@ethersproject/address'

import { useTokenContract } from './useContract'
import { useCorrectNetworkURL } from './useCorrectNetworkURL'

export const useTokenBalance = (tokenAddress, isToken) => {
  const { account, library } = useWeb3React()
  const [ balance, setBalance ] = useState(BigNumber.from('0'))
  const contract = useTokenContract(tokenAddress)
  const isNetworkCorrect = useCorrectNetworkURL()

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

    if (account && library && contract && isNetworkCorrect) {
      fetchBalance()
    } else {
      mounted && setBalance(BigNumber.from('0'))
    }

    return () => mounted = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, library, tokenAddress, isToken, isNetworkCorrect])

  return balance
}
