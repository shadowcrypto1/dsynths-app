import { Provider as ReduxProvider } from 'react-redux'
import { Web3ReactProvider } from '@web3-react/core'
import { ModalProvider } from 'styled-react-modal'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import Web3ReactManager from '../components/Web3ReactManager'
import Popups from '../components/Popups'
import { Layout } from '../components/Layout'

import store from '../state'
import { getLibrary } from '../utils/library'
import '../styles/index.css'

const Updaters = dynamic(() => import('../state/updaters'), { ssr: false })
const Web3ProviderNetwork = dynamic(() => import('../components/Web3ProviderNetwork'), {
  ssr: false,
})

const SpecialModalBackground = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 30;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
`

const MyApp = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>dSynths Exchange</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <ReduxProvider store={store}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Web3ReactManager>
              <ModalProvider backgroundComponent={SpecialModalBackground}>
                <Popups />
                <Updaters />
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </ModalProvider>
            </Web3ReactManager>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </ReduxProvider>
    </>
  )
}
export default MyApp
