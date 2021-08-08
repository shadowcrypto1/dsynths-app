import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWeb3React } from '@web3-react/core'

import { addPopup, removePopup } from './actions'

export function useModalOpen() {
  return useSelector((state) => {
    return state.application.openModal
  })
}

export function useBlockNumber() {
  const { chainId } = useWeb3React()
  return useSelector((state) => {
    return state.application.blockNumber[chainId ?? -1]
  })
}

export function useAddPopup() {
  const dispatch = useDispatch()
  return useCallback(({ content, key, removeAfterMs }) => {
    dispatch(addPopup({ content, key, removeAfterMs }))
  }, [dispatch])
}

export function useRemovePopup() {
  const dispatch = useDispatch()
  return useCallback((key) => {
    dispatch(removePopup({ key }))
  }, [dispatch])
}

export function useActivePopups() {
  const list = useSelector((state) => {
    return state.application.popupList
  })
  return useMemo(() => list.filter((item) => item.show), [list])
}
