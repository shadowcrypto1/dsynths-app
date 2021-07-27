import { createReducer } from '@reduxjs/toolkit'

import { replaceMarketState  } from './actions'

const initialState = {
  baseSymbol: undefined,
  pairSymbol: undefined,
  networkName: undefined,
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(replaceMarketState, (state, {payload}) => {
      return payload
    })
)
