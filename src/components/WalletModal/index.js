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
  display: flex;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(109.2deg, #532EE6 2.09%, #6A3EA6 99.42%);
  width: clamp(200px, 75%, 420px);
  border-radius: 20px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  padding: 15px;
  width: 100%;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  color: #FFFFFF;
  font-size: 20px;
  font-weight: bold;
`

const Close = styled(CloseIcon)`
  align-self: center;
  &:hover {
    cursor: pointer;
  }
`

const Body = styled.ul`
  padding: 0;
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
  background: #30315D;
  justify-content: space-between;
  border-radius: 12px;
  font-size: 16px;

  ${({error}) => error ? `
    border: 1px solid red;
    color: red;
    &:hover {
      cursor: pointer;
      border: 1px solid red;
    }
  ` : `
    border: 1px solid #2C2F36;
    color: inherit;
    &:hover {
      cursor: pointer;
      border: 1px solid #2172E5;
    }
  `}
`

const ConnectorNameWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & > * {
    &:first-child {
      margin-right: 10px;
    }
  }
`

const ConnectorLogo = styled.img`
  width: 30px;
  height: 30px;
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
  cursor: default;

  &:hover {
    background: #2C2F36;
    border: 1px solid red;
    cursor: pointer;
  }
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
          <Close onClick={closeModalProxy}/>
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
                <ConnectorNameWrapper>
                  <ConnectorLogo src={`/images/connectors/${name.toLowerCase()}.png`}/>
                  {name}
                </ConnectorNameWrapper>
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
