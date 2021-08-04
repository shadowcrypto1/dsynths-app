import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Modal from 'styled-react-modal'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
import { WalletConnectConnector, UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import styled from 'styled-components'

import { useModalOpen } from '../../state/application/hooks'
import { setOpenModal } from '../../state/application/actions'
import { connectorsByName } from '../../connectors'

import {
  Close as CloseIcon,
  Loader as LoaderIcon
} from '../Icons'

const StyledModal = Modal.styled`
  background-color: #191B1F;
  width: clamp(200px, 75%, 420px);
  border-radius: 20px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  padding: 15px
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  color: #FFFFFF;
  font-size: 20px;
  font-weight: bold;
`

const Body = styled.ul`
  padding: 0px;
  list-style-type: none;
  margin-block-end: 0;
`

const ConnectorWrapper = styled.li`
  display: flex;
  width: auto;
  height: 50px;
  margin: 10px 0px;
  padding: 0 7px 0 20px;
  align-items: center;
  background: #212429;
  border: ${props => props.error ? '1px solid red' : '1px solid #2C2F36'};
  justify-content: space-between;
  border-radius: 12px;
  font-size: 16px;
  color: ${props => props.error ? 'red' : 'inherit'};

  &:hover {
    background: #2C2F36;
    border: 1px solid #2172E5;
    cursor: pointer;
  }
`

const ErrorBox = styled.div`
  display: flex;
  height: calc(60%);
  min-width: 80px;
  align-items: center;
  justify-content: center;

  background: #2C2F36;
  color: #FFFFFF;
  border: 1px solid #2C2F36;
  border-radius: 5px;
`

export const WalletModal = () => {
  const { connector, activate, chainId } = useWeb3React()
  const dispatch = useDispatch()
  const isOpen = useModalOpen()
  const [ errorBoxText, setErrorBoxText ] = useState('')
  const [ displayErrorBox, setDisplayErrorBox ] = useState(false)
  const [ activatingConnector, setActivatingConnector] = useState(undefined)
  const [ cachedConnectorName, setCachedConnectorName ] = useState(undefined)

  // handle logic to recognize the connector currently being activated
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector, chainId])

  const closeModalProxy = () => {
    dispatch(setOpenModal(false))
    setDisplayErrorBox(false)
  }

  const tryActivation = (connectorInstance) => {
    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (connectorInstance instanceof WalletConnectConnector && connectorInstance.walletConnectProvider?.wc?.uri) {
      connectorInstance.walletConnectProvider = undefined
    }

    activate(connectorInstance, undefined, true)
      .then(() => closeModalProxy())
      .catch((error) => {
        console.error(error)
        if (error instanceof UserRejectedRequestErrorInjected || error instanceof UserRejectedRequestErrorWalletConnect) { 
          setErrorBoxText('Error connecting')
        } else if (error instanceof UnsupportedChainIdError) {
          setErrorBoxText('This network is not supported')
        } else if (error instanceof NoEthereumProviderError) {
          setErrorBoxText('Install Metamask first!')
        }
        setDisplayErrorBox(true)
      })
  }

  return (
    <StyledModal
      isOpen={isOpen}
      onBackgroundClick={closeModalProxy}
      onEscapeKeydown={closeModalProxy}
    >
      <Wrapper>
        <Header>
          Select a wallet provider
          <CloseIcon onClick={closeModalProxy}/>
        </Header>
        <Body>
          {Object.keys(connectorsByName).map(name => {
            const currentConnector = connectorsByName[name]
            const activating = connector === currentConnector
            return (
              <ConnectorWrapper
                key={name}
                onClick={() => {
                  setActivatingConnector(currentConnector)
                  setCachedConnectorName(currentConnector)
                  tryActivation(currentConnector)
                }}
              >
                {name}
                {activating && <LoaderIcon size="20px" />}
              </ConnectorWrapper>
            )
          })}
          {displayErrorBox && (
            <ConnectorWrapper error={true}>
              {errorBoxText}
              <ErrorBox onClick={() => tryActivation(cachedConnectorName)}>
                Try Again
              </ErrorBox>
            </ConnectorWrapper>
          )}
        </Body>
      </Wrapper>
    </StyledModal>
  )
}
