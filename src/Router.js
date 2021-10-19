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
import ScrollToTop from './hooks/useScrollToTop'

import Dashboard from './pages/Dashboard'
import Simple from './pages/Simple'
import Basic from './pages/Basic'
import Markets from './pages/Markets'
import Fiat from './pages/Fiat'
import Portfolio from './pages/Portfolio'

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
  return (
    <Layout>
      <Switch>
        <Route path='/exchange/basic'>
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
        <Redirect to='/exchange/basic?network=xdai'/>
      </Switch>
    </Layout>
  )
}

export default function Router() {
  return (
    <BrowserRouter>
      <Updaters/>
      <ScrollToTop/>
      <Routes/>
    </BrowserRouter>
  )
}
