import { useEffect, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'

import { useTokenContract } from './useContract'
import { useCorrectNetworkURL } from './useCorrectNetworkURL'

export function useTokenAllowance(tokenAddress, spenderAddress) {
  const { account, library } = useWeb3React()
  const contract = useTokenContract(tokenAddress)
  const [ allowance, setAllowance ] = useState(BigNumber.from('0'))
  const isNetworkCorrect = useCorrectNetworkURL()

  useEffect(() => {
    let mounted = true
    const fetchAllowance = async () => {
      try {
        const result = await contract.allowance(account, spenderAddress)
        mounted && setAllowance(result)
      } catch (err) {
        console.error(err)
        mounted && setAllowance(BigNumber.from('0'))
      }
    }

    if (account && library && contract && isNetworkCorrect) {
      fetchAllowance()
    } else {
      mounted && setAllowance(BigNumber.from('0'))
    }

    return () => mounted = false
  }, [account, library, tokenAddress, spenderAddress, contract, isNetworkCorrect])

  return allowance
}
