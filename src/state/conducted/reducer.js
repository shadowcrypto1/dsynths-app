import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { makeHttpRequest } from '../../utils/http'

const initialState = {
  status: 'LOADING',
  data: [],
}

export const fetchConducted = createAsyncThunk(
  'conducted/fetchConducted',
  async (networkName) => {
    if (!networkName) return []
    try {
      console.log('Fetching conducted tokens on network: ', networkName)
      const result = await makeHttpRequest(`https://oracle1.deus.finance/${networkName.toLowerCase()}/conducted.json`)
      return result?.tokens ?? []
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
        state.data = []
        state.status = 'LOADING'
      })
      .addCase(fetchConducted.fulfilled, (state, { payload }) => {
        state.data = payload
        state.status = 'OK'
      })
      .addCase(fetchConducted.rejected, (state) => {
        state.data = []
        state.status = 'ERROR'
      })
  }
})

export default conductedSlice.reducer
