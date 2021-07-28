import { useSelector } from 'react-redux'

export function useSynchronizerState() {
  return useSelector((state) => {
    return state.synchronizer
  })
}
