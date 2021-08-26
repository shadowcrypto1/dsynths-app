import React, { useEffect } from 'react'
import { BrowserRouter, Switch, Route, Redirect, useLocation } from 'react-router-dom'

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
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Basic from './pages/Basic'

import useGoogleAnalytics from './hooks/useGoogleAnalytics'

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

function Routes () {
  useGoogleAnalytics()
  return (
    <Layout>
      <Switch>
        <Route path={['/', '/home']} exact>
          <Home/>
        </Route>
        <Route path='/exchange'>
          <Basic/>
        </Route>
        <Route path='/terms'>
          <Terms/>
        </Route>
        <Route path='/privacy'>
          <Privacy/>
        </Route>
        <Redirect to='/'/>
      </Switch>
    </Layout>
  )
}

export default function Router() {
  return (
    <BrowserRouter>
      <Updaters/>
      <Routes/>
    </BrowserRouter>
  )
}
