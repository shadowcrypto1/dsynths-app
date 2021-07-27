import { createReducer } from '@reduxjs/toolkit'
import { resetState, setApprove, setSyncOpen, setSyncClose} from './actions'

const initialState = {
  approve: 'IDLE',
  syncOpen: 'IDLE',
  syncClose: 'IDLE',
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(resetState, (state, action) => {
      return initialState
    })
    .addCase(setApprove, (state, {payload}) => {
      return state = {
        ...state,
        approve: payload
      }
    })
    .addCase(setSyncOpen, (state, {payload}) => {
      return state = {
        ...state,
        syncOpen: payload
      }
    })
    .addCase(setSyncClose, (state, {payload}) => {
      return state = {
        ...state,
        syncClose: payload
      }
    })
)
