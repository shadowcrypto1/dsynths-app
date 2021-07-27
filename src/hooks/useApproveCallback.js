import { useCallback, useMemo } from 'react'
import { MaxUint256 } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'

import { SYNCHRONIZER_ADDRESSES_BY_CHAIN_ID } from '../constants'
import { useTokenContract } from './useContract'
import { useTokenAllowance } from './useTokenAllowance'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'

export const ApprovalState = {
  UNKNOWN: 'UNKNOWN',
  NOT_APPROVED: 'NOT_APPROVED',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
}

export function calculateGasMargin(value) {
  return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000))
}

export function useApproveCallback({
  address,
  isToken,
  symbol,
  type,
}) {
  const { account, chainId } = useWeb3React()
  const spenderContract = SYNCHRONIZER_ADDRESSES_BY_CHAIN_ID[chainId]
  const tokenAddress = isToken ? address : undefined
  const currentAllowance = useTokenAllowance(tokenAddress, spenderContract)
  const pendingApproval = useHasPendingApproval(address, spenderContract)

  // Check the current approval status
  const approvalState = useMemo(() => {
    if (!spenderContract) return ApprovalState.UNKNOWN
    if (!currentAllowance) return ApprovalState.UNKNOWN
    if (!isToken) return ApprovalState.APPROVED

    return (currentAllowance.gt(0))
      ? ApprovalState.APPROVED
      : pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
  }, [currentAllowance, pendingApproval, spenderContract])

  const TokenContractInstance = useTokenContract(address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(async () => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!chainId) {
      console.error('no chainId')
      return
    }

    if (!TokenContractInstance) {
      console.error('TokenContractInstance is null')
      return
    }

    if (!address) {
      console.error('address is null')
      return
    }

    if (!spenderContract) {
      console.error('no spenderContract')
      return
    }

    const estimatedGas = await TokenContractInstance.estimateGas.approve(spenderContract, MaxUint256)
    return TokenContractInstance
      .approve(spenderContract, MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
      .then(response => {
        addTransaction(response, {
          summary: {
            header: type.toUpperCase(),
            body: `Approve ${symbol}`
          },
          approval: { tokenAddress: address, spender: spenderContract },
        })
      })
      .catch(error => {
        console.debug('Failed to approve token', error)
      })
  }, [approvalState, tokenAddress, TokenContractInstance, spenderContract, addTransaction, chainId])

  return [approvalState, approve]
}
