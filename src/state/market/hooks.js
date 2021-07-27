import { useSelector } from 'react-redux'

export const useMarketState = () => {
  return useSelector(state => {
    return state.market
  })
}
