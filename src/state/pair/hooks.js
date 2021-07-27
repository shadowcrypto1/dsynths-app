import { useSelector } from 'react-redux'

export const usePairState = () => {
  return useSelector(state => {
    return state.pair
  })
}
