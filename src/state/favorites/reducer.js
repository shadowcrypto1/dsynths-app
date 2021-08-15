import { createReducer } from '@reduxjs/toolkit'
import { replaceFavorite } from './actions'

const initialState = {
  favorites: getLocalStorage('favorites', []),
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(replaceFavorite, (state, {payload: { favorites }}) => {
      state.favorites = favorites
      setLocalStorage('favorites', favorites)
    })
)

function getLocalStorage (key, initialValue) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.log(error);
    return initialValue;
  }
}

function setLocalStorage (key, value) {
  try {
    const val = value ?? []
    window.localStorage.setItem(key, JSON.stringify(val))
  } catch (error) {
    console.log(error)
  }
}
