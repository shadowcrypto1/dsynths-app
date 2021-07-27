import { useSelector } from 'react-redux'

export const useActionState = () => {
  return useSelector(state => {
    return state.action.action
  })
}
