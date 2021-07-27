import { useEffect, useMemo, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'

import { useTokenContract } from './useContract'

export function useTokenAllowance(tokenAddress, spenderAddress) {
  const { account, library, chainId } = useWeb3React()
  const contract = useTokenContract(tokenAddress)
  const [ allowance, setAllowance ] = useState(BigNumber.from('0'))

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

    if (account && library && contract) {
      fetchAllowance()
    } else {
      mounted && setAllowance(BigNumber.from('0'))
    }

    return () => mounted = false
  }, [account, library, tokenAddress, spenderAddress, contract])

  return allowance
}
