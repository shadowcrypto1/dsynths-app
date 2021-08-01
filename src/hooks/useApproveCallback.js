import { useCallback, useMemo } from 'react'
import { MaxUint256 } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'

import { SYNCHRONIZER_ADDRESSES_BY_CHAIN_ID } from '../constants'
import { useTokenContract } from './useContract'
import { useTokenAllowance } from './useTokenAllowance'
import { useTransactionAdder, useHasPendingApproval } from '../state/transactions/hooks'
import { useAddPopup } from '../state/application/hooks'

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
}) {
  const { chainId } = useWeb3React()
  const spender = SYNCHRONIZER_ADDRESSES_BY_CHAIN_ID[chainId]
  const tokenAddress = isToken ? address : undefined
  const currentAllowance = useTokenAllowance(tokenAddress, spender)
  const pendingApproval = useHasPendingApproval(address, spender)
  const addPopup = useAddPopup()

  // Check the current approval status
  const approvalState = useMemo(() => {
    if (!spender) return ApprovalState.UNKNOWN
    if (!currentAllowance) return ApprovalState.UNKNOWN
    if (!isToken) return ApprovalState.APPROVED

    return (currentAllowance.gt(0))
      ? ApprovalState.APPROVED
      : pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
  }, [currentAllowance, pendingApproval, spender, isToken])

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

    if (!spender) {
      console.error('no spender')
      return
    }

    const estimatedGas = await TokenContractInstance.estimateGas.approve(spender, MaxUint256)
    return TokenContractInstance
      .approve(spender, MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
      .then(response => {
        console.log(response)
        // start listening for receipt
        addTransaction({
          hash: response.hash,
          summary: {
            chainId: chainId,
            hash: response.hash,
            eventName: 'approval',
            params: {
              symbol,
            }
          },
          approval: { tokenAddress: address, spender: spender },
        })

        // transaction submitted // TODO: beautify this
        addPopup({
          content: {
            success: true,
            summary: {
              eventName: 'message',
              message: 'Approval transaction submitted',
            },
          },
          removeAfterMs: 5000,
        })
      })
      .catch(error => {
        console.error('Failed to approve token for an unknown reason', error)
        if (error.code === 4001) return  // user rejected tx
        addPopup({
          content: {
            success: false,
            summary: {
              eventName: 'message',
              message: 'Failed to approve token, check the logs for more information.',
            },
          },
          removeAfterMs: 15000,
        })
      })
  }, [approvalState, tokenAddress, TokenContractInstance, spender, addTransaction, chainId])

  return [approvalState, approve]
}
