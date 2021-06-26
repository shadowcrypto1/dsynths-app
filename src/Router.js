import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import { Layout } from './components/Layout'
import TradeClassic from './pages/Trade/Classic'

import './styles/index.css'

export default function App() {
	return (
		<BrowserRouter>
			<Layout>
				<Switch>
					<Route
						exact
						path="/trade/classic"
						component={() => (
							<TradeClassic />
						)}
					/>
					<Redirect from="*" to="/trade/classic?ticker=GME" />
				</Switch>
			</Layout>
		</BrowserRouter>
	)
}
