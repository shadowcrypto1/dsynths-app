import { BigNumber } from '@ethersproject/bignumber'
import { isAddress } from '@ethersproject/address'
import Web3 from 'web3'

function calculateGasMargin(value) {
  return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000))
}

export default async function ({
  price = undefined,
  SynchronizerContract = null,
  action = null,
  payload = null,
  account = null,
  submitCallback = null,
  errorCallback = null
} = {}) {
  try {
    if (price === undefined) {
      throw new Error('price is missing')
    }
    if (!SynchronizerContract || typeof SynchronizerContract !== 'object') {
      throw new Error('SynchronizerContract is either missing or corrupted: ', SynchronizerContract)
    }
    if (!action || typeof action !== 'string') {
      throw new Error('action is either missing or corrupted: ', action)
    }
    if (!payload || typeof payload !== 'object' ) {
      throw new Error('payload is either missing or corrupted: ', payload)
    }
    if (!account || !isAddress(account)) {
      throw new Error('account is either missing or not a valid address: ', account)
    }
    if (
      !submitCallback || typeof submitCallback !== 'function' ||
      !errorCallback || typeof errorCallback !== 'function'
    ) {
      throw new Error('callback functions are not provided')
    }

    const method = (action === 'OPEN') ? 'buy' : 'sell'
    let mappedPayload = Object.values(payload).slice(1) // remove _user for the XDAI proxy AMM

    let options = {
      from: account,
      gasPrice: Web3.utils.toWei('1', 'Gwei'),
    }

    if (action === 'OPEN') {
      let xdaiAmount = await SynchronizerContract.calculateXdaiAmount(price, payload.fee.toString(), payload.amount)
      let estimatedGas = await SynchronizerContract.estimateGas[method](...mappedPayload, {
        from: account,
        value: xdaiAmount,
      })
      options['value'] = xdaiAmount
      options['gasLimit'] = calculateGasMargin(BigNumber.from(estimatedGas)).toString()
    } else {
      let estimatedGas = await SynchronizerContract.estimateGas[method](...mappedPayload, { from: account })
      options['gasLimit'] = calculateGasMargin(BigNumber.from(estimatedGas)).toString()
    }

    return SynchronizerContract.[method](...mappedPayload, options)
      .then(submitCallback)
      .catch(errorCallback)
  } catch (error) {
    errorCallback(error)
  }
}
