import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { makeHttpRequest } from '../../utils/http'

const initialState = {
  status: 'LOADING',
  data: {},
}

export const fetchQuotes = createAsyncThunk(
  'quotes/fetchQuotes',
  async (networkName) => {
    if (!networkName) return {}
    try {
      console.log('Fetching quotes on network: ', networkName)
      const result = await makeHttpRequest(`https://oracle1.deus.finance/${networkName.toLowerCase()}/price.json`)
      return result || {}
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
      .addCase(fetchQuotes.fulfilled, (state, {payload}) => {
        state.data = payload
        state.status = 'OK'
      })
      .addCase(fetchQuotes.rejected, (state) => {
        state.data = {}
        state.status = 'ERROR'
      })
  }
})

export default quotesSlice.reducer
