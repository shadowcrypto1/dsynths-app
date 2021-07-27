import { createReducer } from '@reduxjs/toolkit'

import { updateAction, flipAction } from './actions'

const initialState = {
  action: 'OPEN'
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateAction, (state, { payload }) => {
      state.action = validateAction(payload.action)
    })
    .addCase(flipAction, (state) => {
      state.action = switchAction(state.action)
    })
)

function switchAction(state) {
  switch (state) {
    case 'OPEN':
      return 'CLOSE'
    case 'CLOSE':
      return 'OPEN'
    default:
      return 'OPEN'
  }
}

function validateAction (arg) {
  switch (arg) {
    case 'OPEN':
      return 'OPEN'
    case 'CLOSE':
      return 'CLOSE'
    default:
      return 'OPEN'
  }
}
