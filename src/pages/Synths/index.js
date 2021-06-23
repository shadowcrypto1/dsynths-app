import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { ThemeContext } from '../../context/ThemeContext'

import { TVChartContainer } from '../../components/TVChartContainer'
import { MarketHistoryLarge, AccountHistoryLarge } from '../../components/TransactionsHistory'
import { SynthStats } from '../../components/SynthStats'

import { Card } from '../../components/Card'
import { Button, LinkButton } from '../../components/Button'
import { Break } from '../../components/Break'

import { useTopRegistrars } from '../../hooks/registrars'
import { widgetOptions as getWidgetOptions } from './widgetOptions'
import Datafeed from './datafeed'

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

const TokensBar = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
`

const MidWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 10px;
  width: 100%;
  height: 500px;
`

const ChartWrapper = styled(Card)`
  padding: 5px; /* additional padding because the chart instance has no border-radius */
  background: ${props => props.theme === 'light' ? '#FFFFFF' : '#131722'}
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
	const { theme } = useContext(ThemeContext)
	let { ticker } = useParams()
	ticker = (ticker) ? ticker.toUpperCase() : 'GME'

	const datafeed = new Datafeed({ ticker })
	const widgetOptions = getWidgetOptions({ theme, datafeed })

	const [ showMarketHistory, setShowMarketHistory ] = useState(true)
	const [ showAccountHistory, setShowAccountHistory ] = useState(false)

	// topRegistrars is just temporary
	const topRegistrars = useTopRegistrars()
	const mappedTopRegistrars = topRegistrars.reduce((acc, obj) => {
		const tickerOnly = obj.symbol.split('-').shift(0).substring(1) // dGME-L becomes GME and dLBS becomes LBS
		if (acc.includes(tickerOnly)) return acc
		acc.push(tickerOnly)
		return acc
	}, [])

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
			<TokensBar>
				<div style={{display: 'flex'}}>
					{mappedTopRegistrars.length >= 1 && mappedTopRegistrars.map((symbol, index) => {
						return (
							<LinkButton
								key={index}
								selected={symbol === ticker}
								to={symbol}
							>
								{symbol}
							</LinkButton>
						)
					})}
				</div>
			</TokensBar>
			<MidWrapper>
				{/*special wrapper for the chart because the chart has no border-radius*/}
				<ChartWrapper theme={theme}>
					<TVChartContainer widgetOptions={widgetOptions}/>
				</ChartWrapper>
				<SynthStats ticker={ticker}/>
			</MidWrapper>
			<TableWrapper>
				<TableNavigation>
					<Button selected={showMarketHistory} onClick={() => toggleTabs('market')}>Market History</Button>
					<Button selected={showAccountHistory} onClick={() => toggleTabs('account')}>Your Trades</Button>
				</TableNavigation>
				<Break />
				{showMarketHistory && <MarketHistoryLarge ticker={ticker}/>}
				{showAccountHistory && <AccountHistoryLarge ticker={ticker}/>}
			</TableWrapper>
		</Wrapper>
	)
}
