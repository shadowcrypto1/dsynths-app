import { useWeb3 } from '../hooks/useWeb3'
import ERC20ABI from '../../config/abi/ERC20ABI.json'

const getContract = (abi, address, web3) => {
  try {
    return new web3.eth.Contract(abi, address)
  } catch (err) {
    console.error('Failed to get contract', err);
    return null
  }
}

export const getERC20Contract = (address, web3) => {
  return getContract(ERC20ABI, address, web3)
}
