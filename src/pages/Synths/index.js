import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Chart } from '../../components/Pages/Synths/Chart/Chart'
import { AccountHistory } from '../../components/Pages/Synths/TransactionsTable/AccountHistory'
import { MarketHistory } from '../../components/Pages/Synths/TransactionsTable/MarketHistory'
import { Widget } from '../../components/Pages/Synths/Widget'
import { TopRegistrars } from '../../components/Pages/Synths/TopRegistrars'

import { Card } from '../../components/Card'
import { Button, LinkButton } from '../../components/Button'
import { Break } from '../../components/Break'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin-top: 20px;
  margin-left: 50%;
  transform: translateX(-50%);

  & > * {
    margin: 5px;
  }
`

const MidWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 10px;
  width: 100%;
  height: 500px;
`

const TableWrapper = styled(Card)`
  display: block;
  padding: 10px 5px;
  > * {
    &:nth-child(2) {
      margin-top: 10px;
      margin-bottom: 15px;
    }
  }
`

const TableNavigation = styled.div`
  display: flex;
  justify-content: flex-start;
`

export default function () {
	let { ticker } = useParams()
	ticker = (ticker) ? ticker.toUpperCase() : 'GME'

	const [ showMarketHistory, setShowMarketHistory ] = useState(true)
	const [ showAccountHistory, setShowAccountHistory ] = useState(false)

	useEffect(() => {
		document.title = `${ticker} Info | dSynths.io`
	}, [ticker])

	const toggleTabs = (type) => {
		switch (type) {
		case 'market':
			setShowMarketHistory(true)
			setShowAccountHistory(false)
			break
		case 'account':
			setShowMarketHistory(false)
			setShowAccountHistory(true)
			break
		default:
			setShowMarketHistory(true)
			setShowAccountHistory(false)
		}
	}

	return (
		<Wrapper>
      <TopRegistrars />
			<MidWrapper>
				<Chart ticker={ticker}/>
				<Widget ticker={ticker}/>
			</MidWrapper>
			<TableWrapper>
				<TableNavigation>
					<Button selected={showMarketHistory} onClick={() => toggleTabs('market')}>Market History</Button>
					<Button selected={showAccountHistory} onClick={() => toggleTabs('account')}>Your Trades</Button>
				</TableNavigation>
				<Break />
				{showMarketHistory && <MarketHistory ticker={ticker}/>}
				{showAccountHistory && <AccountHistory ticker={ticker}/>}
			</TableWrapper>
		</Wrapper>
	)
}
