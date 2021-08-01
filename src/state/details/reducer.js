import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { makeHttpRequest } from '../../utils/http'

const initialState = {
  status: 'LOADING',
  data: [],
}

export const fetchDetails = createAsyncThunk(
  'details/fetchDetails',
  async () => {
    try {
      console.log('Fetching registrar details')
      const result = await makeHttpRequest('https://oracle1.deus.finance/registrar-detail.json')
      return result || {}
    } catch (err) {
      console.error(err)
      return {}
    }
  }
)

const detailsSlice = createSlice({
  name: 'details',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDetails.pending, (state) => {
        state.data = {}
        state.status = 'LOADING'
      })
      .addCase(fetchDetails.fulfilled, (state, { payload }) => {
        state.data = payload
        state.status = 'OK'
      })
      .addCase(fetchDetails.rejected, (state) => {
        state.data = {}
        state.status = 'ERROR'
      })
  }
})

export default detailsSlice.reducer
