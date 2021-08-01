import { BigNumber } from '@ethersproject/bignumber'
import { isAddress } from '@ethersproject/address'
import Web3 from 'web3'

function calculateGasMargin(value) {
  return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000))
}

export default async function ({
  price = undefined,
  AMMContractInstance = null,
  action = null,
  payload = null,
  account = null,
  submitCallback = null,
  errorCallback = null
} = {}) {
  try {
    if (!AMMContractInstance || typeof AMMContractInstance !== 'object') {
      throw new Error('AMMContractInstance is either missing or corrupted: ', AMMContractInstance)
    }
    if (!action || typeof action !== 'string') {
      throw new Error('action is either missing or corrupted: ', action)
    }
    if (action === 'OPEN' && price === undefined) {
      throw new Error('price is missing')
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
      let xdaiAmount = await AMMContractInstance.methods.calculateXdaiAmount(price, payload.fee.toString(), payload.amount).call()
      let estimatedGas = await AMMContractInstance.methods[method](...mappedPayload).estimateGas({
        from: account,
        value: xdaiAmount,
      })
      options['value'] = xdaiAmount
      options['gasLimit'] = calculateGasMargin(BigNumber.from(estimatedGas)).toString()
    } else {
      let estimatedGas = await AMMContractInstance.methods[method](...mappedPayload).estimateGas({ from: account })
      options['gasLimit'] = calculateGasMargin(BigNumber.from(estimatedGas)).toString()
    }

    return AMMContractInstance.methods[method](...mappedPayload).send(options)
      .on('transactionHash', submitCallback)
      .on('error', (error) => {throw error})

  } catch (error) {
    errorCallback(error)
  }
}
