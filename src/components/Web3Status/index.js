import React from 'react'
import { useDispatch } from 'react-redux'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

import { WalletModal } from '../WalletModal'
import { setOpenModal } from '../../state/application/actions'
import { useMarketState } from '../../state/market/hooks'
import { truncateAddress } from '../../utils/account'
import { injected } from '../../connectors'
import { SUPPORTED_CHAINS_BY_ID } from '../../constants'

const Button = styled.button`
  min-width: 150px;
  height: 30px;
  background: rgba(91, 96, 204, 0.15);
  border: 1px solid rgba(146, 119, 224, 0.5);
  border-radius: 6px;
  font-size: 12.5px;
  line-height: 16px;
  align-items: center;
  text-align: center;
  color: #FFFFFF;
`

const Connected = styled(Button)`
  display: flex;
  justify-content: space-between;
  padding: 0px 10px;
  background: rgba(91, 96, 204, 0.15);
  border: 1px solid rgba(146, 119, 224, 0.5);
  &:hover {
    cursor: pointer;
    background: rgba(91, 96, 204, 0.25);
  }
`

const NetworkLogo = styled.img`
  width: 20px;
  height: 20px;
`

const Error = styled(Button)`
  background: rgba(91, 96, 204, 0.15);
  border: 1px solid rgba(146, 119, 224, 0.5);
`

const Connect = styled(Button)`
  background: rgba(91, 96, 204, 0.15);
  border: 1px solid rgba(146, 119, 224, 0.5);
  &:hover {
    cursor: pointer;
    background: rgba(91, 96, 204, 0.25);
  }
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
  const { chainId, account, active, error, connector, deactivate } = useWeb3React()
  const dispatch = useDispatch()

  const onClickProxy = () => {
    if (!account || !active) {
      dispatch(setOpenModal(true))
    } else {
      dispatch(setOpenModal(false))
      deactivate()
      if (connector !== injected) {
        connector.close()
      }
    }
  }

  if (account) {
    return (
      <Connected onClick={onClickProxy}>
        <NetworkLogo src={require(`../../assets/networks/${SUPPORTED_CHAINS_BY_ID[chainId].toLowerCase()}.png`)}/>
        {truncateAddress(account)}
        <div/>
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
