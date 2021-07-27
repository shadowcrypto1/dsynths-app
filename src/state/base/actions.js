import { createAction } from '@reduxjs/toolkit'

export const updateStatus = createAction('base/updateStatus')
export const updateSymbol = createAction('base/updateSymbol')
export const updateQuote = createAction('base/updateQuote')
export const noQuote = createAction('base/noQuote')
