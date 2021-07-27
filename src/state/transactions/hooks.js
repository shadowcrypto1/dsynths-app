import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { useWeb3React } from '@web3-react/core'
import { useActiveWeb3React } from '../../hooks/useWeb3'

import { addTransaction } from './actions'

export function useTransactionAdder() {
  const { chainId, account } = useActiveWeb3React()
  const dispatch = useDispatch()

  return useCallback((response, { summary, approval }) => {
    if (!account) return
    if (!chainId) return

    const { hash } = response
    if (!hash) {
      throw new Error('No transaction hash found.')
    }
    dispatch(addTransaction({ hash, from: account, chainId, approval, summary }))
  }, [dispatch, chainId, account])
}

// returns all the transactions for the current chain
export function useAllTransactions() {
  const { chainId } = useActiveWeb3React()

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
