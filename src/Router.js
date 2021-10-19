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
import Dashboard from './pages/Dashboard'
import Simple from './pages/Simple'
import Basic from './pages/Basic'
import Markets from './pages/Markets'
import Fiat from './pages/Fiat'
import Portfolio from './pages/Portfolio'

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
        <Route path={['/', '/exchange', '/exchange/basic']} exact>
          <Basic/>
        </Route>
        <Route path='/exchange/simple'>
          <Simple/>
        </Route>
        <Route path='/dashboard'>
          <Dashboard/>
        </Route>
        <Route path='/markets'>
          <Markets/>
        </Route>
        <Route path='/portfolio'>
          <Portfolio/>
        </Route>
        <Route path='/fiat'>
          <Fiat/>
        </Route>
        <Redirect to='/exchange/basic'/>
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
