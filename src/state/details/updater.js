import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { fetchDetails } from './reducer'

export default function Updater() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchDetails())
  }, [dispatch])
  return null
}
