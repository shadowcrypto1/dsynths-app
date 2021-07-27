import { useSelector } from 'react-redux'

export const useQuotesState = () => {
  return useSelector(state => {
    return state.quotes
  })
}
