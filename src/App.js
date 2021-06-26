import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { ModalProvider } from 'styled-react-modal'

import { ThemeProvider } from './context/ThemeContext'
import Router from './Router'

import { getLibrary } from './web3/utils/library'

import './styles/index.css'

export default function App() {
	return (
		<>
			<Web3ReactProvider getLibrary={getLibrary}>
				<ThemeProvider>
					<ModalProvider>
						<Router/>
					</ModalProvider>
				</ThemeProvider>
			</Web3ReactProvider>
		</>
	)
}
