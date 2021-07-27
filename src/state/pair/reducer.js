import { createReducer } from '@reduxjs/toolkit'

import { updatePair } from './actions'

const initialState = {
  isToken: false,
  contract: '',
  decimals: 18,
  symbol: '',
 }

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updatePair, (state, {payload}) => {
      return payload
    })
)
