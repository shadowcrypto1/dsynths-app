import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import queryString from 'query-string'

import { Chart } from '../../components/Pages/Synths/Chart/Chart'
import { AccountHistory } from '../../components/Pages/Synths/Table/AccountHistory'
import { MarketHistory } from '../../components/Pages/Synths/Table/MarketHistory'
import { AccountBalance } from '../../components/Pages/Synths/Table/AccountBalance'
import { Widget } from '../../components/Pages/Synths/Widget/Widget'
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
  height: 550px;
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
	const { search } = useLocation()
  let { ticker } = queryString.parse(search)
	ticker = (ticker) ? ticker.toUpperCase() : 'GME'

	const [ showMarketHistory, setShowMarketHistory ] = useState(false)
  const [ showAccountHistory, setShowAccountHistory ] = useState(false)
	const [ showAccountBalance, setShowAccountBalance ] = useState(true)

	useEffect(() => {
		document.title = `${ticker} Info | dSynths.io`
	}, [ticker])

	const toggleTabs = (type) => {
		switch (type) {
		case 'market':
			setShowMarketHistory(true)
			setShowAccountHistory(false)
      setShowAccountBalance(false)
			break
		case 'account':
			setShowMarketHistory(false)
			setShowAccountHistory(true)
      setShowAccountBalance(false)
			break
    case 'balance':
			setShowMarketHistory(false)
			setShowAccountHistory(false)
      setShowAccountBalance(true)
			break
		default:
			setShowMarketHistory(true)
			setShowAccountHistory(false)
      setShowAccountBalance(false)
		}
	}

	return (
		<Wrapper>
      <TopRegistrars ticker={ticker} />
			<MidWrapper>
				<Chart ticker={ticker}/>
				<Widget key={ticker} ticker={ticker}/>
			</MidWrapper>
			<TableWrapper>
				<TableNavigation>
					<Button selected={showMarketHistory} onClick={() => toggleTabs('market')}>Market History</Button>
          <Button selected={showAccountHistory} onClick={() => toggleTabs('account')}>Your Trades</Button>
					<Button selected={showAccountBalance} onClick={() => toggleTabs('balance')}>Your Balance</Button>
				</TableNavigation>
				<Break />
				{showMarketHistory && <MarketHistory ticker={ticker}/>}
        {showAccountHistory && <AccountHistory ticker={ticker}/>}
				{showAccountBalance && <AccountBalance ticker={ticker}/>}
			</TableWrapper>
		</Wrapper>
	)
}
