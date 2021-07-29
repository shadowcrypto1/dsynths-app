import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWeb3React } from '@web3-react/core'

import { addTransaction } from './actions'

export function useTransactionAdder() {
  const { chainId, account } = useWeb3React()
  const dispatch = useDispatch()

  return useCallback((response, { summary, approval }) => {
    if (!account) return
    if (!chainId) return

    // blockHash: "0xdb7277b50e6f956f82b2c2fea89407cb766b90d612123b86d830b9c2d0902957"
    // blockNumber: 12921366
    // contractAddress: null
    // cumulativeGasUsed: 9385809
    // effectiveGasPrice: "0x826299e00"
    // events: {0: {…}, 1: {…}, Buy: {…}}
    // from: "0x1164fe7a76d22eaa66f6a0adce3e3a30d9957a5f"
    // gasUsed: 109265
    // status: true
    // to: "0x7a27a7bf25d64faa090404f94606c580ce8e1d37"
    // transactionHash: "0xa01b175f3f20b0ee9f5ee78a4807eb1d8b62a22fbe1681419dcc068f3b91017e"

    const { hash, transactionHash } = response
    if (!hash && !transactionHash) {
      throw new Error('No transaction hash found.')
    }
    const finalHash = hash ?? transactionHash
    dispatch(addTransaction({ hash: finalHash, from: account, chainId, approval, summary }))
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
