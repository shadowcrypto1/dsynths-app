import React, { Fragment, useState, useEffect } from 'react'
import styled from 'styled-components'
import ReactImageFallback from "react-image-fallback";

import { Card } from '../../../Card'
import { Stats } from './Stats'
import { Trade } from './Trade'

import { getSymbolVariants } from '../../../../utils/registrars'
import { getRegistrars } from '../../../../web3/apollo/controllers'

const Wrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const Header = styled.div`
  height: 15%;
  width: 100%;
  padding: 0 10px;

  border-radius: 5px;
  background-color: var(--c-primary5);
  color: var(--font-primaryText1);
  align-items: center;

  display: grid;
  grid-gap: 15px;
  grid-template-columns: 1fr 2fr;
`

const TickerWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`

const Ticker = styled.div`
  display: inline-block;
  font-size: 40px;
  text-align: center;
`

const TickerLogo = styled(ReactImageFallback)`
  width: 40px;
  height: 40px;
  margin-left: 10px;
  margin-right: 5px;
`

const NameWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Name = styled.a`
  display: block;
  text-decoration: none;
  font-size: 12px;
  text-align: center;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

const fetchRegistrars = async (ticker) => {
	try {
		const symbolMapping = getSymbolVariants(ticker, 'stock')
		return await getRegistrars(symbolMapping)
	} catch (err) {
		console.error(err)
		return []
	}
}

export const Widget = ({ ticker }) => {
  const [ showStats, setShowStats ] = useState(false)
	const [ showTrade, setShowTrade ] = useState(true)

  const [ symbols, setSymbols ] = useState([])
	const [ names, setNames ] = useState([])
	const [ contracts, setContracts ] = useState([])
	const [ totalFeesDAI, setTotalFeesDAI ] = useState(0)
	const [ totalVolumeDAI, setTotalVolumeDAI ] = useState(0)
	const [ totalVolumeRegistrar, setTotalVolumeRegistrar ] = useState(0)
	const [ txCount, setTxCount ] = useState(0)

	const createStats = async () => {
		const registrars = await fetchRegistrars(ticker)
		const stats = registrars.reduce((acc, obj) => {
      acc.symbols.push(obj.symbol)
			acc.names.push(obj.name)
			acc.contracts.push(obj.id)
			acc.totalFeesDAI += Number(obj.totalFeesDAI)
			acc.totalVolumeDAI += Number(obj.totalVolumeDAI)
			acc.totalVolumeRegistrar += Number(obj.totalVolumeRegistrar)
			acc.txCount += Number(obj.txCount)
			return acc
		}, {
      symbols: [],
			names: [],
			contracts: [],
			totalFeesDAI: 0,
			totalVolumeDAI: 0,
			totalVolumeRegistrar: 0,
			txCount: 0,
		})
    setSymbols(stats.symbols)
		setNames(stats.names)
		setContracts(stats.contracts)
		setTotalFeesDAI(stats.totalFeesDAI)
		setTotalVolumeDAI(stats.totalVolumeDAI)
		setTotalVolumeRegistrar(stats.totalVolumeRegistrar)
		setTxCount(stats.txCount)
	}

	useEffect(() => {
		createStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ticker])

	return (
		<Wrapper>
			<Header>
        <TickerWrapper>
  				<Ticker>{ticker}</Ticker>
          <TickerLogo
            src={`/img/tickers/${ticker}.png`}
            fallbackImage={'/img/fallback/ticker.png'}
            alt={`${ticker}_logo`}
          />
        </TickerWrapper>
				<NameWrapper>
					{names.map((name, index) => (
						<Name
							key={index}
							target="_blank"
							rel="noopener noreferrer"
							href={`https://etherscan.io/token/${contracts[index]}`}
						>
							{name}
						</Name>
					))}
				</NameWrapper>
			</Header>
      {showStats && <Stats
        ticker={ticker}
        toggle={() => {
          setShowStats(false)
          setShowTrade(true)
        }}
        totalFeesDAI={totalFeesDAI}
        totalVolumeDAI={totalVolumeDAI}
        totalVolumeRegistrar={totalVolumeRegistrar}
        txCount={txCount}
      />}
      {showTrade && <Trade
        toggle={() => {
          setShowStats(true)
          setShowTrade(false)
        }}
        ticker={ticker}
      />}
    </Wrapper>
	)
}
