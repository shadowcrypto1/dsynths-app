import { createReducer } from '@reduxjs/toolkit'
import { addTransaction, clearAllTransactions, checkedTransaction, finalizeTransaction } from './actions'

const now = () => new Date().getTime()

export const initialState = {}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(addTransaction, (state, { payload: { hash, from, chainId, summary, approval } }) => {
      if (state[chainId]?.[hash]) {
        throw new Error('Attempted to add existing transaction.')
      }
      const txs = state[chainId] ?? {}
      txs[hash] = { hash, from, summary, approval, addedTime: now() }
      state[chainId] = txs
    })
    .addCase(clearAllTransactions, (transactions, { payload }) => {
      const { chainId } = payload
      if (!transactions[chainId]) return
      transactions[chainId] = {}
    })
    .addCase(checkedTransaction, (transactions, { payload }) => {
      const { chainId, hash, blockNumber } = payload
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      if (!tx.lastCheckedBlockNumber) {
        tx.lastCheckedBlockNumber = blockNumber
      } else {
        tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber)
      }
    })
    .addCase(finalizeTransaction, (transactions, { payload }) => {
      const { hash, chainId, receipt } = payload
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      tx.receipt = receipt
      tx.confirmedTime = now()
    })
)
