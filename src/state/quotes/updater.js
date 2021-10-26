import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { fetchQuotes } from './reducer'

export default function Updater() {
  const dispatch = useDispatch()

  useEffect(() => {
    const self = setInterval(() => {
      dispatch(fetchQuotes())
    }, [30 * 1000])
    dispatch(fetchQuotes())

    return (() => clearInterval(self))
  }, [dispatch])

  return null
}
