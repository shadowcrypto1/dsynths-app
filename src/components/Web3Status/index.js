import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { UnsupportedChainIdError } from '@web3-react/core'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks/useWeb3'

import { WalletModal } from '../WalletModal'
import { setOpenModal } from '../../state/application/actions'
import { truncateAddress } from '../../utils/account'

const Button = styled.button`
  width: 150px;
  height: 30px;
  background: rgba(91, 96, 204, 0.15);
  border: 1px solid rgba(146, 119, 224, 0.5);
  border-radius: 6px;
  font-size: 12.5px;
  line-height: 16px;
  align-items: center;
  text-align: center;
  color: #FFFFFF;

  &:hover {
    cursor: pointer;
    background: rgba(91, 96, 204, 0.25);
  }
`

const Connected = styled(Button)`
  background: rgba(91, 96, 204, 0.15);
  border: 1px solid rgba(146, 119, 224, 0.5);
`

const Error = styled(Button)`
  background: rgba(91, 96, 204, 0.15);
  border: 1px solid rgba(146, 119, 224, 0.5);
`

const Connect = styled(Button)`
  background: rgba(91, 96, 204, 0.15);
  border: 1px solid rgba(146, 119, 224, 0.5);
`

export const Web3Status = () => {
  return (
    <>
      <StatusButton />
      <WalletModal />
    </>
  )
}

function StatusButton() {
  const { account, active, connector, error, deactivate } = useActiveWeb3React()
  const dispatch = useDispatch()

  const onClickProxy = () => {
    (!account || !active) && dispatch(setOpenModal(true))
  }

  if (account) {
    return (
      <Connected onClick={onClickProxy}>
        {truncateAddress(account)}
      </Connected>
    )
  } else if (error) {
    return (
      <Error onClick={onClickProxy}>
       {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Connect to a wallet'}
      </Error>
    )
  } else {
    return (
      <Connect onClick={onClickProxy}>
        Connect to a wallet
      </Connect>
    )
  }
}