import { useSelector } from 'react-redux'

export const useBaseState = () => {
  return useSelector(state => {
    return state.base
  })
}
