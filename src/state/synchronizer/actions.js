import { createAction } from '@reduxjs/toolkit'

export const resetState = createAction('synchronizer/resetState')
export const setApprove = createAction('synchronizer/setApprove')
export const setSyncOpen= createAction('synchronizer/setSyncOpen')
export const setSyncClose = createAction('synchronizer/setSyncClose')
