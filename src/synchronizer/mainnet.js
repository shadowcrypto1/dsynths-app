import { BigNumber } from '@ethersproject/bignumber'
import { isAddress } from '@ethersproject/address'

function calculateGasMargin(value) {
  return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000))
}

export default async function ({
  SynchronizerContract = null,
  action = null,
  payload = null,
  account = null,
  submitCallback = null,
  errorCallback = null
} = {}) {
  try {
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

    const method = (action === 'OPEN') ? 'buyFor' : 'sellFor'
    let mappedPayload = Object.values(payload)

    let estimatedGas = await SynchronizerContract.estimateGas[method](...mappedPayload, { from: account })
    return SynchronizerContract[method](...mappedPayload, {
      from: account,
      gasLimit: calculateGasMargin(BigNumber.from(estimatedGas)).toString(),
    })
      .then(submitCallback)
      .catch(error => {throw error})

  } catch (error) {
    console.error(error)
    errorCallback(error)
  }
}
