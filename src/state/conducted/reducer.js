import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { makeHttpRequest } from '../../utils/http'
import { SUPPORTED_CHAINS_BY_NAME } from '../../constants'

const initialState = {
  status: 'LOADING',
  data: {},
}

export const fetchConducted = createAsyncThunk(
  'conducted/fetchConducted',
  async () => {
    try {
      const networkMapping = Object.keys(SUPPORTED_CHAINS_BY_NAME)
      const promises = networkMapping.map(networkName => {
        return makeHttpRequest(`https://oracle1.deus.finance/${networkName.toLowerCase()}/conducted.json`)
      })

      console.log('Fetching conducted tokens:')
      const results = await Promise.allSettled(promises)

      // Bind results to according network (Promise.All preserves the mapping order)
      return results.reduce((acc, res, index) => {
        acc[networkMapping[index]] = res.status === 'fulfilled' ? res.value?.tokens ?? [] : []
        return acc
      }, {})
    } catch (err) {
      console.error(err)
      return []
    }
  }
)

const conductedSlice = createSlice({
  name: 'conducted',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchConducted.pending, (state) => {
        state.data = {}
        state.status = 'LOADING'
      })
      .addCase(fetchConducted.fulfilled, (state, { payload }) => {
        // Cross filter conducted among chains and index them
        state.status = 'OK'
        state.data = Object.entries(payload).reduce((acc, keyPair) => {
          const [networkName, values] = keyPair
          for (let i = 0; i < values.length; i++) {
            let asset = values[i]
            if (!acc[asset.id]) {
              acc[asset.id] = []
            }
            acc[asset.id].push({
              networkName: networkName,
              long: asset.long,
              short: asset.short,
            })
          }
          return acc
        }, {})
      })
      .addCase(fetchConducted.rejected, (state) => {
        state.data = {}
        state.status = 'ERROR'
      })
  }
})

export default conductedSlice.reducer
