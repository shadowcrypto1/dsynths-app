import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import ApplicationUpdater from './state/application/updater'
import BaseUpdater from './state/base/updater'
import ConductedUpdater from './state/conducted/updater'
import DetailsUpdater from './state/details/updater'
import MarketUpdater from './state/market/updater'
import PairUpdater from './state/pair/updater'
import QuotesUpdater from './state/quotes/updater'
import TransactionUpdater from './state/transactions/updater'

import { Layout } from './components/Layout'
import Home from './pages/Home'
import Basic from './pages/Basic'

function Updaters() {
  return (
    <>
      <ApplicationUpdater />
      <BaseUpdater />
      <ConductedUpdater />
      <DetailsUpdater />
      <MarketUpdater />
      <PairUpdater />
      <QuotesUpdater />
      <TransactionUpdater />
    </>
  )
}

export default function Router() {
	return (
		<BrowserRouter>
			<Updaters/>
			<Layout>
				<Switch>
          <Route path={['/', '/home']} exact>
            <Home/>
          </Route>
					<Route path='/exchange'>
						<Basic/>
					</Route>
					<Redirect to='/'/>
				</Switch>
			</Layout>
		</BrowserRouter>
	)
}
