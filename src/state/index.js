import { configureStore } from '@reduxjs/toolkit'

import action from './action/reducer'
import application from './application/reducer'
import base from './base/reducer'
import conducted from './conducted/reducer'
import details from './details/reducer'
import favorites from './favorites/reducer'
import market from './market/reducer'
import pair from './pair/reducer'
import synchronizer from './synchronizer/reducer'
import transactions from './transactions/reducer'
import quotes from './quotes/reducer'

const store = configureStore({
  reducer: {
    action,
    application,
    base,
    conducted,
    details,
    favorites,
    market,
    pair,
    synchronizer,
    transactions,
    quotes,
  },
})

export default store
