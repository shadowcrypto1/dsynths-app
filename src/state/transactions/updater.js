import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { useWeb3React } from '@web3-react/core'
import { useWeb3React } from '../../hooks/useWeb3'

import { retry, RetryableError } from '../../utils/retry'
import { updateBlockNumber } from '../application/actions'
import { useBlockNumber, useAddPopup } from '../application/hooks'
import { checkedTransaction, finalizeTransaction } from './actions'

export function shouldCheck(lastBlockNumber, tx) {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  } else if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  } else {
    // otherwise every block
    return true
  }
}

const RETRY_OPTIONS_BY_CHAIN_ID = {
  // [SUPPORTED_CHAINS_BY_NAME.XDAI]: { n: 10, minWait: 250, maxWait: 1000 },
}
const DEFAULT_RETRY_OPTIONS = { n: 1, minWait: 0, maxWait: 0 }

export default function Updater() {
  const { chainId, library } = useWeb3React()
  const lastBlockNumber = useBlockNumber()

  const dispatch = useDispatch()
  const state = useSelector((state) => state.transactions)

  const transactions = useMemo(() => (chainId ? state[chainId] ?? {} : {}), [chainId, state])

  // Show popup on confirm
  const addPopup = useAddPopup()

  const getReceipt = useCallback((hash) => {
    if (!library || !chainId) throw new Error('No library or chainId')
    const retryOptions = RETRY_OPTIONS_BY_CHAIN_ID[chainId] ?? DEFAULT_RETRY_OPTIONS
    return retry(
      () =>
        library.getTransactionReceipt(hash).then((receipt) => {
          if (receipt === null) {
            console.debug('Retrying for hash', hash)
            throw new RetryableError()
          }
          return receipt
        }),
      retryOptions
    )
  },
  [chainId, library]
  )

  useEffect(() => {
    if (!chainId || !library || !lastBlockNumber) return

    const cancels = Object.keys(transactions)
      .filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
      .map((hash) => {
        const { promise, cancel } = getReceipt(hash)
        promise
          .then((receipt) => {
            if (receipt) {
              dispatch(
                finalizeTransaction({
                  chainId,
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex,
                  },
                })
              )

              addPopup({
                content: {
                  hash: hash,
                  success: receipt.status === 1,
                  summary: transactions[hash]?.summary,
                },
                key: hash,
                removeAfterMs: 10000,
              })

              // The receipt was fetched before the block, fast forward to that block to trigger balance updates
              if (receipt.blockNumber > lastBlockNumber) {
                dispatch(updateBlockNumber({ chainId, blockNumber: receipt.blockNumber }))
              }
            } else {
              dispatch(checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }))
            }
          })
          .catch((error) => {
            if (!error.isCancelledError) {
              console.error(`Failed to check transaction hash: ${hash}`, error)
            } else {
              console.error('Unknown error', error)
            }
          })
        return cancel
      })

    return () => {
      cancels.forEach((cancel) => cancel())
    }
  }, [chainId, library, transactions, lastBlockNumber, dispatch, addPopup, getReceipt])

  return null
}
