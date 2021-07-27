import { useSelector } from 'react-redux'

export const useConductedState = () => {
  return useSelector(state => {
    return state.conducted
  })
}
