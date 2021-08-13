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

import GoogleAnalyticsReporter from './components/Analytics/GoogleAnalyticsReporter'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import Basic from './pages/Basic'
import Basic2 from './pages/Basic2'

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
      <Route component={GoogleAnalyticsReporter} />
      <Updaters/>
      <Layout>
        <Switch>
          <Route path={['/', '/home']} exact>
            <Home/>
          </Route>
          <Route path='/exchange'>
            <Basic/>
          </Route>
          <Route path='/exchange2'>
            <Basic2/>
          </Route>
          <Redirect to='/'/>
        </Switch>
      </Layout>
    </BrowserRouter>
  )
}
