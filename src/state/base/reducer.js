import { createReducer } from '@reduxjs/toolkit'

import { updateStatus, updateSymbol, updateQuote, noQuote } from './actions'

const initialQuote = {
  price: 0,
  fee: 0.01,
  isClosed: false,
}

const initialState = {
  status: 'LOADING',
  symbol: '',
  type: '',
  name: '',
  long: {
    symbol: '',
    contract: '',
    decimals: 18,
    isToken: true,
    initialQuote,
  },
  short: {
    symbol: '',
    contract: '',
    decimals: 18,
    isToken: true,
    initialQuote,
  }
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateStatus, (state, {payload}) => {
      return {
        ...state,
        status: payload.status,
      }
    })
    .addCase(updateSymbol, (state, {payload}) => {
      const {
        symbol,
        assetType,
        name,
        longSymbol, longContract, longDecimals, longIsToken,
        shortSymbol, shortContract, shortDecimals, shortIsToken,
      } = payload

      return {
        ...state,
        status: 'OK',
        symbol,
        assetType,
        name,
        long: {
          ...state.long,
          symbol: longSymbol,
          contract: longContract,
          decimals: longDecimals,
          isToken: longIsToken,
        },
        short: {
          ...state.short,
          symbol: shortSymbol,
          contract: shortContract,
          decimals: shortDecimals,
          isToken: shortIsToken,
        }
      }
    })
    .addCase(noQuote, (state) => {
      return {
        ...state,
        long: {
          ...state.long,
          initialQuote,
        },
        short: {
          ...state.short,
          initialQuote,
        },
      }
    })
    .addCase(updateQuote, (state, {payload}) => {
      const {
        longPrice, longFee, longIsClosed,
        shortPrice, shortFee, shortIsClosed,
      } = payload
      return {
        ...state,
        long: {
          ...state.long,
          price: longPrice,
          fee: longFee,
          isClosed: longIsClosed,
        },
        short: {
          ...state.short,
          price: shortPrice,
          fee: shortFee,
          isClosed: shortIsClosed,
        },
      }
    })
)
