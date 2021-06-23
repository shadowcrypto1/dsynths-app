import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import { Layout } from './components/Layout'
import SynthsPage from './pages/Synths'

import './styles/index.css'

export default function App() {
	return (
		<BrowserRouter>
			<Layout>
				<Switch>
					<Route
						exact
						path="/synths/:ticker"
						component={() => (
							<SynthsPage />
						)}
					/>
					<Redirect from="*" to="/synths/GME" />
				</Switch>
			</Layout>
		</BrowserRouter>
	)
}
