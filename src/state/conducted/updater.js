import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { fetchConducted } from './reducer'

export default function Updater() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchConducted())
  }, [dispatch])
  return null
}
