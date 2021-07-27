import { MaxUint256 } from '@ethersproject/constants'
import Web3 from 'web3'

import { ContractMapping } from '../../../constants'
import { makeHttpRequest } from  '../../../utils/http'

export const getMarketMaker = (networkName) => {
  return ContractMapping[networkName].MM_SYNC
}

export const urls = [
  "https://oracle1.deus.finance/mainnet/signatures.json", // TODO: add chains
  "https://oracle3.deus.finance/mainnet/signatures.json",
]

export const MIN_SIGNATURES = 2

export const toWei = (number) => {
  let result = Web3.utils.toWei(String(number), 'ether');
  result = result.substr(0, result.length);
  return result.toString()
}

export const buy = async (AMMContract, outputContract, outputAmount, account, onSuccess, onError) => {
  const oracleData = await getOracleData()
  if (!oracleData) return // TODO: error

  const priceProps = parseOracleData({
    data: oracleData,
    type: 'buy',
    targetContract: outputContract,
  })
  if (!priceProps) return // TODO: error

  const blockNosMapping = priceProps.map(node => node.blockNo.toString())
  const priceMapping = priceProps.map(node => node.price)
  const vMapping = priceProps.map(node => node.signs.buy.v.toString())
  const rMapping = priceProps.map(node => node.signs.buy.r.toString())
  const sMapping = priceProps.map(node => node.signs.buy.s.toString())

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
  const contractPayload = {
    _user: account,
    multiplier: priceProps[0].multiplier.toString(),
    registrar: outputContract,
    amount: toWei(outputAmount), // stringified in the toWei function
    fee: priceProps[0].fee.toString(),
    blockNos: blockNosMapping,
    prices: priceMapping,
    v: vMapping,
    r: rMapping,
    s: sMapping,
  }

  return AMMContract.buyFor(
    contractPayload._user,
    contractPayload.multiplier,
    contractPayload.registrar,
    contractPayload.amount,
    contractPayload.fee,
    contractPayload.blockNos,
    contractPayload.prices,
    contractPayload.v,
    contractPayload.r,
    contractPayload.s,
   )
    .then(res => onSuccess(res))
    .catch(err => onError(err));
}

export const approve = async (Contract, inputContract, account, spender, onSuccess, onError) => {
  return Contract.approve(spender, MaxUint256)
    .then(res => onSuccess(res))
    .catch(err => onError(err));
}

// TODO: turn into hook
const getOracleData = async () => {
  try {
    const responses = await Promise.allSettled(
      urls.map(url => makeHttpRequest(url))
    )

    // TODO: add feedback mechanism to admins in case a node is down
    return responses.map((response, i) => {
      if (response.status === 'fulfilled') return response.value
    })
  } catch (err) {
    console.error(err);
    return null
  }
}

/**
 * @param data {Array} mapping of each api response, contains {Objects}
 * @param type {String} buy or sell
 * @param targetContract {String} contract of synthetic to buy/sell
 * @output
 */
const parseOracleData = ({
  data,
  type,
  targetContract,
}) => {
  try {
    console.log('Parsing oracledata:');
    console.log(data);

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

    if (type === 'buy') return createBuyProps(priceFeed)
    return createSellProps(priceFeed)

  } catch (err) {
    console.error(err)
    return null
  }
}

const createBuyProps = (priceFeed) => {
  console.log('Preparing buy properties to conduct transaction')

  let data = priceFeed.sort(comparePrice)
  return data.sort(compareOrder)
}

const createSellProps = (priceFeed) => {
  console.log('Preparing sell properties to conduct transaction')

  let data = priceFeed.sort(comparePrice).reverse()
  return data.sort(compareOrder)
}

function comparePrice(a, b) {
  const A = parseInt(a.price);
  const B = parseInt(b.price);

  let comparison = 0;
  if (A > B) {
    comparison = -1;
  } else if (A < B) {
    comparison = 1;
  }

  return comparison;
}

function compareOrder(a, b) {
  const A = a.index;
  const B = b.index;

  let comparison = 0;
  if (A > B) {
    comparison = 1;
  } else if (A < B) {
    comparison = -1;
  }
  return comparison;
}
