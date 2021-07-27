import { useSelector } from 'react-redux'

export const useDetailsState = () => {
  return useSelector(state => {
    return state.details
  })
}
