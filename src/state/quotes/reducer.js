import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import _ from 'lodash'

import { makeHttpRequest } from '../../utils/http'
import { SUPPORTED_CHAINS_BY_NAME } from '../../constants'

const initialState = {
  status: 'LOADING',
  data: {},
}

export const fetchQuotes = createAsyncThunk(
  'quotes/fetchQuotes',
  async () => {
    try {
      const networkMapping = Object.keys(SUPPORTED_CHAINS_BY_NAME)
      const promises = networkMapping.map(networkName => {
        return makeHttpRequest(`https://oracle1.deus.finance/${networkName.toLowerCase()}/price.json`)
      })

      console.log('Fetching quotes')
      const results = await Promise.allSettled(promises)

      // Bind results to according network (Promise.All preserves the mapping order)
      return results.reduce((acc, res, index) => {
        acc[networkMapping[index]] = res.status === 'fulfilled' ? res.value ?? [] : []
        return acc
      }, {})
    } catch (err) {
      console.error(err)
      return {}
    }
  }
)

const quotesSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchQuotes.pending, (state) => {
        state.data = {}
        state.status = 'LOADING'
      })
      .addCase(fetchQuotes.fulfilled, (state, { payload }) => {
        // Cross filter conducted among chains and index them
        state.status = 'OK'
        state.data = Object.entries(payload).reduce((acc, keyPair) => {
          const [networkName, values] = keyPair
          for (const asset in values) {
            let prices = values[asset]
            if (!acc[asset]) {
              acc[asset] = []
            }

            // if market is closed the price returns {}
            acc[asset].push({
              networkName: networkName,
              long: _.isEmpty(prices?.Long) ? null : prices.Long,
              short: _.isEmpty(prices?.Short) ? null : prices.Short,
            })
          }
          return acc
        }, {})
      })
      .addCase(fetchQuotes.rejected, (state) => {
        state.data = {}
        state.status = 'ERROR'
      })
  }
})

export default quotesSlice.reducer
