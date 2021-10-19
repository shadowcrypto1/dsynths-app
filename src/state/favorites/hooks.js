import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { replaceFavorite } from './actions'

export function useFavorites() {
  return useSelector((state) => {
    return state.favorites.favorites
  })
}

export function useToggleFavorite() {
  const dispatch = useDispatch()
  const favorites = useFavorites()

  return useCallback((value) => {
    const index = favorites.indexOf(value)
    dispatch(replaceFavorite({
      favorites: (index > -1)
        ? favorites.filter(item => item !== value)
        : favorites.concat([value])
    }))
  }, [favorites, dispatch])
}
