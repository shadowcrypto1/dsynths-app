import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { Provider as ReduxProvider } from 'react-redux'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import { ModalProvider } from 'styled-react-modal'

import Router from './Router'
import Web3ReactManager from './components/Web3ReactManager'
import Popups from './components/Popups'
import { NetworkContextName } from './constants/misc'
import { isMobile } from 'react-device-detect'

import store from './state'
import { getLibrary } from './utils/library'
import './styles/index.css'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

const GOOGLE_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
    gaOptions: {
      storage: 'none',
      storeGac: false,
    },
  })
  ReactGA.set({
    anonymizeIp: true,
    customBrowserType: !isMobile
      ? 'desktop'
      : 'web3' in window || 'ethereum' in window
      ? 'mobileWeb3'
      : 'mobileRegular',
  })
} else {
  ReactGA.initialize('test', { testMode: true, debug: true })
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
