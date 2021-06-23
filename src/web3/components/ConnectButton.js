import React, { useState, useEffect } from 'react'
import Modal from 'styled-react-modal'
import styled from 'styled-components'

import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
import { WalletConnectConnector, UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'

import { ThemeButton } from '../../components/Button'
import { Close } from '../../components/Icons/Close'
import { Loader } from '../../components/Loader'

import { useEagerConnect, useInactiveListener } from '../hooks'
import { connectorsByName, supportedChainIds } from '../connectors'
import { truncateAddress } from '../../utils/account'
import { getErrorMessage } from '../utils'

const StyledModal = Modal.styled`
  background-color: var(--c-bg0);
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
  color: var(--font-text1);
  font-size: var(--fontsize-header);
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
  background: var(--c-bg2);
  border: ${props => props.error ? '1px solid red' : '1px solid var(--c-bg3)'};
  justify-content: space-between;
  border-radius: 12px;
  font-size: var(--fontsize-block);
  color: ${props => props.error ? 'red' : 'inherit'};

  &:hover {
    background: var(--c-bg3);
    border: 1px solid var(--c-primary3);
    cursor: pointer;
  }
`

const ErrorBox = styled.div`
  display: flex;
  height: calc(60%);
  min-width: 80px;
  align-items: center;
  justify-content: center;

  background: var(--c-bg3);
  color: var(--font-text1);
  border: 1px solid var(--c-bg3);
  border-radius: 5px;
`

export const ConnectButton = () => {
	const context = useWeb3React()
	const { connector, chainId, account, activate, deactivate, active, error  } = context

	const [ modalVisibility, setModalVisibility] = useState(false)
	const [ buttonText, setButtonText ] = useState('Connect Wallet')
	const [ buttonDisabled, setButtonDisabled ] = useState(false)
  const [ errorBoxText, setErrorBoxText ] = useState('')
	const [ displayErrorBox, setDisplayErrorBox ] = useState(false)
	const [ cachedConnectorName, setCachedConnectorName ] = useState(undefined)

	// in the process of connecting with provider => to enable the spinner
	const [activatingConnector, setActivatingConnector] = useState()
	useEffect(() => {
		if (activatingConnector && activatingConnector === connector) {
			setActivatingConnector(undefined)
		}
	}, [activatingConnector, connector])

	// handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
	const triedEager = useEagerConnect()

	// handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
	useInactiveListener(!triedEager || !!activatingConnector)

	useEffect(() => {
    handleConnectEvents({ payload: "default" })
		setModalVisibility(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [account])

	useEffect(() => {
    if (!error) return // on init

		if (
			error instanceof UserRejectedRequestErrorInjected ||
      error instanceof UserRejectedRequestErrorWalletConnect
		) {
			handleConnectEvents({ payload: "userRejected" })
      return
		}

    if (error instanceof UnsupportedChainIdError) {
			handleConnectEvents({ payload: "networkError" })
      return
		}

    if (error instanceof NoEthereumProviderError) {
      handleConnectEvents({ payload: "noEthereumProviderError" })
      return
    }

		resetWalletConnector()
    console.log(getErrorMessage(error))
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error])

	useEffect(() => {
		isCorrectChain()
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainId])

	const closeModal = () => {
		setModalVisibility(false)
		setDisplayErrorBox(false)
	}

	const handleConnectButton = () => {
		if (buttonDisabled) return
		if (account) return deactivate()
		return setModalVisibility(true)
	}

	function handleConnectEvents ({ payload }) {
    if (payload === "default") {
      setDisplayErrorBox(false)
      if (account) {
        setButtonDisabled(false)
        setButtonText(truncateAddress(account))
      } else {
        setButtonText('Connect Wallet')
      }
      return
    }

    if (payload === "userRejected") {
      setButtonDisabled(false)
      setDisplayErrorBox(true)
      setErrorBoxText("Error connecting")
      setButtonText('Connect Wallet')
      return
    }

    if (payload === "noEthereumProviderError") {
      setButtonDisabled(false)
      setDisplayErrorBox(true)
      setButtonText("Connect Wallet")
      setErrorBoxText("Install Metamask first!")
      return
    }

    if (payload === "networkError") {
      setButtonDisabled(true)
    	setButtonText('Wrong Network')
      setDisplayErrorBox(false)
      closeModal()
      return
    }
	}

	function isCorrectChain () {
		if (active && !supportedChainIds.includes(chainId)) {
      return handleConnectEvents({ payload: "networkError"})
		}
    return handleConnectEvents({ payload: "default"})
	}

	// walletconnect has this bug where it doesn't reload after closing the window, remove connector in that case
	function resetWalletConnector () {
		if (
			connector &&
      connector instanceof WalletConnectConnector &&
      connector.walletConnectProvider?.wc?.uri
		) {
			connector.walletConnectProvider = undefined
		}
	}

	// on page load, do nothing until we've tried to connect to the injected connector
	if (!triedEager) {
		return null
	}

	return (
		<React.Fragment>
			<ThemeButton
				disabled={buttonDisabled}
				onClick={handleConnectButton}
			>{buttonText}</ThemeButton>
			<StyledModal
				isOpen={modalVisibility}
				onBackgroundClick={closeModal}
				onEscapeKeydown={closeModal}
			>
				<Wrapper>
					<Header>
            Select a wallet provider
						<Close onClick={closeModal}/>
					</Header>
					<Body>
						{Object.keys(connectorsByName).map(name => {
							const currentConnector = connectorsByName[name]
							const activating = currentConnector === activatingConnector
							return (
								<ConnectorWrapper
									key={name}
									onClick={() => {
										setActivatingConnector(currentConnector)
										setCachedConnectorName(currentConnector)
										handleConnectEvents({ payload: "default" })
										activate(currentConnector)
									}}
								>
									{name}
									{activating && <Loader size="20px" />}
								</ConnectorWrapper>
							)
						})}
						{displayErrorBox && (
							<ConnectorWrapper error={true}>
                {errorBoxText}
								<ErrorBox onClick={() => activate(cachedConnectorName)}>
                  Try Again
								</ErrorBox>
							</ConnectorWrapper>
						)}
					</Body>
				</Wrapper>
			</StyledModal>
		</React.Fragment>
	)
}
