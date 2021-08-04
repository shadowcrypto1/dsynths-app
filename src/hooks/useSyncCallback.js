import { useCallback, useMemo } from 'react'
// import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
import { useWeb3React } from './useWeb3'

import { useAMMContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useAddPopup } from '../state/application/hooks'
import { useActionState } from '../state/action/hooks'
import { useSignatureUrls } from './useSignatureUrls'
import { makeHttpRequest } from  '../utils/http'
import { syncMainnet, syncXDAI } from '../synchronizer'

export const MIN_SIGNATURES = 2
export const EXPECTED_SIGNATURES = 2 // // TODO: hook this with './useSignatureUrls'

export const SyncState = {
  PENDING: 'PENDING',
  IDLE: 'IDLE',
}

export function useSyncCallback({
  inputSymbol,
  inputAmount,
  inputContract,
  inputDecimals,
  outputSymbol,
  outputContract,
  outputDecimals,
  outputAmount,
  type
}) {
  const { account, chainId } = useWeb3React()
  const signatureUrls = useSignatureUrls()
  const action = useActionState()
  const addPopup = useAddPopup()

  const syncState = useMemo(() => {
    if (!account || !chainId) return SyncState.IDLE
    if (!inputContract || !inputAmount || !inputDecimals) return SyncState.IDLE
    if (!outputContract || !outputAmount || !outputDecimals) return SyncState.IDLE
    if (!action) return SyncState.IDLE

    // TODO: add pending
    return SyncState.IDLE
  }, [signatureUrls, action, outputContract])

  const AMMContractInstance = useAMMContract()
  const addTransaction = useTransactionAdder()

  const sync = useCallback(async () => {
    if (syncState === SyncState.PENDING) {
      console.error('tx is already pending')
      return
    }

    if (!account) {
      console.error('no account')
      return
    }

    if (!chainId) {
      console.error('no chainId')
      return
    }

    if (!inputContract) {
      console.error('inputContract is null')
      return
    }

    if (!inputAmount) {
      console.error('inputAmount is null')
      return
    }

    if (!inputDecimals) {
      console.error('inputDecimals is null')
      return
    }

    if (!outputContract) {
      console.error('outputContract is null')
      return
    }

    if (!outputAmount) {
      console.error('outputAmount is null')
      return
    }

    if (!outputDecimals) {
      console.error('outputDecimals is null')
      return
    }

    if (!action) {
      console.error('action is null')
      return
    }

    if (!AMMContractInstance) {
      console.error('AMMContractInstance is null')
      return
    }

    const targetContract = (action === 'OPEN') ? outputContract : inputContract
    const targetAmount = (action === 'OPEN') ? outputAmount : inputAmount
    const targetDecimals = (action === 'OPEN') ? outputDecimals : inputDecimals

    const submitCallback = (hash) => {
      console.log(hash)
      // start listening for receipt
      addTransaction({
        hash: hash,
        summary: {
          chainId: chainId,
          hash: hash,
          action: action,
          type: type,
          eventName: 'transaction',
          params: {
            inputAmount,
            inputSymbol,
            outputAmount,
            outputSymbol,
          }
        }
      })

      // transaction submitted // TODO: beautify this
      addPopup({
        content: {
          success: true,
          summary: {
            eventName: 'message',
            message: 'Trade transaction submitted',
          },
        },
        removeAfterMs: 5000,
      })
    }

    const errorCallback = (error) => {
      console.error('Failed to conduct transaction: ', error)
      alert('the next alert originates from errorCallback')
      alert(error)

      if (error?.code === 4001) return  // user rejected tx
      addPopup({
        content: {
          success: false,
          summary: {
            eventName: 'message',
            message: 'Failed to conduct transaction for an unknown reason, check the logs for more information.',
          },
        },
        removeAfterMs: 15000,
      })
    }

    try {
      const signaturesPerNode = await getSignatures(signatureUrls)
      if (!signaturesPerNode) {
        console.error('signaturesPerNode returned null: ', signaturesPerNode)
        return errorCallback('Unable to fetch oracle signatures')
      }

      const { data, price } = parseSignatures(signaturesPerNode, action, targetContract)
      if (!data) {
        console.error('oracle data is corrupted: ', data)
        return errorCallback('Unable to parse oracle signature data')
      }

      if (action === 'OPEN' && !price) {
        console.error('oracle price is corrupted: ', price)
        return errorCallback('Unable to parse oracle signature prices')
      }

      const signsMethod = (action === 'OPEN') ? 'buy' : 'sell'
      const blockNosMapping = data.map(node => node.blockNo.toString())
      const priceMapping = data.map(node => node.price)
      const vMapping = data.map(node => node.signs[signsMethod].v.toString())
      const rMapping = data.map(node => node.signs[signsMethod].r.toString())
      const sMapping = data.map(node => node.signs[signsMethod].s.toString())

      /**
       * https://github.com/deusfinance/synchronizer-contracts/blob/master/contracts/Synchronizer.sol#L121
       * @param _user {address}
       * @param multiplier {uint256}
       * @param registrar {address}
       * @param amount {uint256}
       * @param fee {uint256}
       * @param blockNos {uint256[]}
       * @param prices {uint256[]}
       * @param v {uint8[]}
       * @param r {bytes32[]}
       * @param s {bytes32[]}
       */
      let payload = {
        _user: account,
        multiplier: data[0].multiplier.toString(),
        registrar: targetContract,
        amount: toWei(targetAmount, targetDecimals), // stringified in the toWei function
        fee: data[0].fee.toString(),
        blockNos: blockNosMapping,
        prices: priceMapping,
        v: vMapping,
        r: rMapping,
        s: sMapping,
      }

      switch (chainId) {
      case 1:
        return syncMainnet({AMMContractInstance, action, payload, account, submitCallback, errorCallback})
      case 100:
        return syncXDAI({AMMContractInstance, price, action, payload, account, submitCallback, errorCallback})
      default:
        return errorCallback(`Sync function call does not exist for chainId: ${chainId}`)
      }
    } catch (error) {
      console.error(error)
      alert('the next error originates from catch')
      alert(error)
      return errorCallback('An unexpected error occured, please check the logs')
    }
  }, [syncState, AMMContractInstance, addTransaction, chainId, inputContract, outputContract, inputAmount, outputAmount, action, signatureUrls])

  return [syncState, sync]
}

function toWei(number, decimals = 18) {
  let value = String(number)
  // Deal with super low amounts by removing any number >= decimals
  const indexDot = value.indexOf('.')
  if (indexDot !== -1 || value.substring(indexDot + 1).length > decimals) {
    value = value.substring(0, indexDot) + value.substring(indexDot, indexDot + decimals + 1)
  }

  let result = Web3.utils.toWei(String(value), 'ether')
  result = result.substr(0, result.length - (18 - decimals))
  return result.toString()
}

async function getSignatures(urls) {
  try {
    // console.log('Fetching signatures');
    if (!urls || !urls.length) throw new Error('URLs are missing')

    const responses = await Promise.allSettled(
      urls.map(url => makeHttpRequest(url, { cache: 'no-cache' }))
    )

    // TODO: add feedback mechanism to admins in case a node is down
    return responses.map((response) => {
      if (response.status === 'fulfilled') return response.value
      throw new Error(`response.status returns unfulfilled: ${response}`)
    })
  } catch (err) {
    console.error(err)
    return null
  }
}

/**
 * @param data {Array} mapping of each api response, contains {Objects}
 * @param action {String} OPEN or CLOSE
 * @param targetContract {String} contract of synthetic to buy/sell
 * @output
 */
function parseSignatures (signaturesPerNode, action, targetContract) {
  try {
    // console.log('Parsing signatures:');
    // console.log(data);

    let priceFeed = []
    for (let i = 0; i < signaturesPerNode.length; i++) {
      let node = signaturesPerNode[i]
      if (targetContract in node) {
        node[targetContract]['index'] = i
        priceFeed.push(node[targetContract])
      }
    }
    if (priceFeed.length < MIN_SIGNATURES) {
      throw new Error('NOT ENOUGH SIGNATURES: There are not enough Oracle signatures. For security reasons, we cannot execute this trade right now.')
    }

    switch (action) {
    case 'OPEN':
      return createBuyParams(priceFeed)
    case 'CLOSE':
      return createSellParams(priceFeed)
    default:
      throw new Error('Action param is invalid: ', action)
    }

  } catch (err) {
    console.error(err)
    return null
  }
}

function createBuyParams (priceFeed) {
  let result = priceFeed.sort(comparePrice)
  let maxPrice = result[0].price
  return {
    price: maxPrice,
    data: result.slice(0, EXPECTED_SIGNATURES).sort(compareOrder)
  }
}

function createSellParams (priceFeed) {
  let result = priceFeed.sort(comparePrice).reverse()
  return {
    data: result.slice(0, EXPECTED_SIGNATURES).sort(compareOrder)
  }
}

function comparePrice(a, b) {
  const A = parseInt(a.price)
  const B = parseInt(b.price)

  let comparison = 0
  if (A > B) {
    comparison = -1
  } else if (A < B) {
    comparison = 1
  }

  return comparison
}

function compareOrder(a, b) {
  const A = a.index
  const B = b.index

  let comparison = 0
  if (A > B) {
    comparison = 1
  } else if (A < B) {
    comparison = -1
  }
  return comparison
}
