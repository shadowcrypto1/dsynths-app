import ApplicationUpdater from './application/updater'
import BaseUpdater from './base/updater'
import ConductedUpdater from './conducted/updater'
import DetailsUpdater from './details/updater'
import MarketUpdater from './market/updater'
import PairUpdater from './pair/updater'
import QuotesUpdater from './quotes/updater'
import TransactionUpdater from './transactions/updater'

export default function Updaters() {
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
