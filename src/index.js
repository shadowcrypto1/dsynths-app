import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import { ModalProvider } from 'styled-react-modal'

import Router from './Router'
import Web3ReactManager from './components/Web3ReactManager'
import Popups from './components/Popups'
import { NetworkContextName } from './constants/misc'

import store from './state'
import { getLibrary } from './utils/library'
import './styles/index.css'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Web3ReactManager>
            <ModalProvider>
              <Popups/>
              <Router/>
            </ModalProvider>
          </Web3ReactManager>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
