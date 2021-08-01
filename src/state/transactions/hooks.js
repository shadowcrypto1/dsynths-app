import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWeb3React } from '@web3-react/core'

import { addTransaction } from './actions'

export function useTransactionAdder() {
  const { chainId, account } = useWeb3React()
  const dispatch = useDispatch()

  return useCallback(({ hash, summary, approval }) => {
    if (!account) return
    if (!chainId) return

    if (!hash) {
      throw new Error('No transaction hash found.')
    }
    if (!summary) {
      throw new Error('Summary is missing.')
    }

    dispatch(addTransaction({ hash, from: account, chainId, summary, approval }))
  }, [dispatch, chainId, account])
}

// returns all the transactions for the current chain
export function useAllTransactions() {
  const { chainId } = useWeb3React()

  const state = useSelector((state) => state.transactions)
  return chainId ? state[chainId] ?? {} : {}
}

export function useIsTransactionPending(transactionHash) {
  const transactions = useAllTransactions()

  if (!transactionHash || !transactions[transactionHash]) return false
  return !transactions[transactionHash].receipt
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx) {
  return new Date().getTime() - tx.addedTime < 86400000
}

export function useHasPendingApproval(tokenAddress, spender) {
  const allTransactions = useAllTransactions()

  return useMemo(
    () =>
      typeof tokenAddress === 'string' &&
      typeof spender === 'string' &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash]
        if (!tx) return false
        if (tx.receipt) {
          return false
        } else {
          const approval = tx.approval
          if (!approval) return false
          return approval.spender === spender && approval.tokenAddress === tokenAddress && isTransactionRecent(tx)
        }
      }),
    [allTransactions, spender, tokenAddress]
  )
}
