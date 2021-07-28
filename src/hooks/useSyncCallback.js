import { useCallback, useMemo } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'

import { useAMMContract } from './useContract'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useActionState } from '../state/action/hooks'
import { useSignatureUrls } from './useSignatureUrls'
import { makeHttpRequest } from  '../utils/http'

export const MIN_SIGNATURES = 2
export const EXPECTED_SIGNATURES = 2 // // TODO: hook this with './useSignatureUrls'

export const SyncState = {
  PENDING: 'PENDING',
  IDLE: 'IDLE',
}

export function calculateGasMargin(value) {
  return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000))
}

export function useSyncCallback({
  inputSymbol,
  inputAmount,
  outputSymbol,
  outputContract,
  outputDecimals,
  outputAmount,
  type
}) {
  const { account, chainId } = useWeb3React()
  const signatureUrls = useSignatureUrls()
  const action = useActionState()

  const syncState = useMemo(() => {
    if (!account || !chainId) return SyncState.IDLE
    if (!outputContract || !outputAmount || !outputDecimals) return SyncState.IDLE
    if (!action) return SyncState.IDLE

    return SyncState.IDLE

    // return (currentAllowance.gt(0))
    //   ? ApprovalState.APPROVED
    //   : pendingApproval
    //     ? ApprovalState.PENDING
    //     : ApprovalState.NOT_APPROVED
  }, [signatureUrls, action, outputContract]) // currentAllowance, pendingApproval, spenderContract

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

    try {
      const signatures = await getSignatures(signatureUrls)
      if (!signatures) {
        console.error('Signatures returned null: ', signatures)
        return
      }

      const txParams = parseSignatures(signatures, action, outputContract)
      if (!txParams) {
        console.error('txParams returned null: ', txParams)
        return
      }

      const blockNosMapping = txParams.map(node => node.blockNo.toString())
      const priceMapping = txParams.map(node => node.price)
      const vMapping = txParams.map(node => node.signs.buy.v.toString())
      const rMapping = txParams.map(node => node.signs.buy.r.toString())
      const sMapping = txParams.map(node => node.signs.buy.s.toString())

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
      const contractPayload = Object.entries({
        _user: account,
        multiplier: txParams[0].multiplier.toString(),
        registrar: outputContract,
        amount: toWei(outputAmount, outputDecimals), // stringified in the toWei function
        fee: txParams[0].fee.toString(),
        blockNos: blockNosMapping,
        prices: priceMapping,
        v: vMapping,
        r: rMapping,
        s: sMapping,
      }).map(([key, value] = []) => value)

      const method = action === 'OPEN' ? 'buyFor' : 'sellFor'
      const estimatedGas = await AMMContractInstance.estimateGas[method](...contractPayload)

      return AMMContractInstance[method](...contractPayload, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
      .then(response => {
        addTransaction(response, {
          summary: {
            header: `${action} - ${type.toUpperCase()}`,
            body: `Trade ${outputAmount} ${outputSymbol} for ${inputAmount} ${inputSymbol}`
          },
        })
      })
      .catch(error => {
        console.error('Transaction has failed: ', error)
      })
    } catch (err) {
      console.error(err)
    }
  }, [syncState, AMMContractInstance, addTransaction, chainId, outputContract, outputAmount, action, signatureUrls])

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
      urls.map(url => makeHttpRequest(url))
    )

    // TODO: add feedback mechanism to admins in case a node is down
    return responses.map((response, i) => {
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
function parseSignatures (data, action, targetContract) {
  try {
    // console.log('Parsing signatures:');
    // console.log(data);

    let priceFeed = []
    for (let i = 0; i < data.length; i++) {
      if (targetContract in data[i]) {
        let node = data[i]
        node['index'] = i
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
  // console.log('Preparing buy properties to conduct transaction')
  let data = priceFeed.sort(comparePrice)
  return data.slice(0, EXPECTED_SIGNATURES).sort(compareOrder)
}

function createSellParams (priceFeed) {
  // console.log('Preparing sell properties to conduct transaction')
  let data = priceFeed.sort(comparePrice).reverse()
  return data.slice(0, EXPECTED_SIGNATURES).sort(compareOrder)
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
