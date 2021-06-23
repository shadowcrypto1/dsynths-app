import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { Card } from '../../components/Card'

import { getSymbolVariants } from '../../utils/registrars'
import { getRegistrars } from '../../web3/apollo/controllers'
import { formatDollarAmount, formatAmount } from '../../utils/numbers'

const StatsWrapper = styled(Card)`
  display: block;
  justify-content: center;
`

const HeaderWrapper = styled.div`
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

const Ticker = styled.div`
  display: inline-block;
  font-size: 40px;
  text-align: center;
`

const ContractWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const ContractName = styled.a`
  display: block;
  text-decoration: none;
  font-size: 12px;
  text-align: center;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

const BodyWrapper = styled.div`
  display: flex-block;
  padding: 5px 10px;
`

const StatBox = styled.div`
  display: flex;
  justify-content: space-between;
  height: 50px;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  color: var(--font-primaryText1);

  border: 1px double var(--c-primary5);
  box-shadow: 3px 3px 5px 1px var(--c-primary5);
  border-radius: 5px;
`

const StatLabel = styled.div`
  font-weight: bold;
`

const StatValue = styled.div`

`

const fetchRegistrarStats = async (ticker) => {
	try {
		const symbolMapping = getSymbolVariants(ticker, 'stock')
		return await getRegistrars(symbolMapping, 10)
	} catch (err) {
		console.error(err)
		return []
	}
}

export const SynthStats = ({ ticker }) => {
	const [ showStats, setShowStats ] = useState(false)

  // const [ symbols, setSymbols ] = useState([])
	const [ names, setNames ] = useState([])
	const [ contracts, setContracts ] = useState([])
	const [ totalFeesDAI, setTotalFeesDAI ] = useState(0)
	const [ totalVolumeDAI, setTotalVolumeDAI ] = useState(0)
	const [ totalVolumeRegistrar, setTotalVolumeRegistrar ] = useState(0)
	const [ txCount, setTxCount ] = useState(0)

	const createStats = async () => {
		const registrars = await fetchRegistrarStats(ticker)
		const stats = registrars.reduce((acc, obj) => {
      // acc.symbols.push(obj.symbol)
			acc.names.push(obj.name)
			acc.contracts.push(obj.id)
			acc.totalFeesDAI += Number(obj.totalFeesDAI)
			acc.totalVolumeDAI += Number(obj.totalVolumeDAI)
			acc.totalVolumeRegistrar += Number(obj.totalVolumeRegistrar)
			acc.txCount += Number(obj.txCount)
			return acc
		}, {
      // symbols: [],
			names: [],
			contracts: [],
			totalFeesDAI: 0,
			totalVolumeDAI: 0,
			totalVolumeRegistrar: 0,
			txCount: 0,
		})
    // setSymbols(stats.symbols)
		setNames(stats.names)
		setContracts(stats.contracts)
		setTotalFeesDAI(stats.totalFeesDAI)
		setTotalVolumeDAI(stats.totalVolumeDAI)
		setTotalVolumeRegistrar(stats.totalVolumeRegistrar)
		setTxCount(stats.txCount)
		setShowStats(true)
	}

	useEffect(() => {
		createStats()
		return (() => setShowStats(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ticker])

	return (
		<StatsWrapper>
			<HeaderWrapper>
				<Ticker>{ticker}</Ticker>
				<ContractWrapper>
					{showStats && names.map((name, index) => (
						<ContractName
							key={index}
							target="_blank"
							rel="noopener noreferrer"
							href={`https://etherscan.io/token/${contracts[index]}`}
						>
							{name}
						</ContractName>
					))}
				</ContractWrapper>
			</HeaderWrapper>
			<BodyWrapper>
				<StatBox>
					<StatLabel>Total Accrued Fees</StatLabel>
					<StatValue>{formatDollarAmount(totalFeesDAI)}</StatValue>
				</StatBox>
        <StatBox>
          <StatLabel>Total Synth Volume</StatLabel>
          <StatValue>{formatAmount(totalVolumeRegistrar)}</StatValue>
        </StatBox>
				<StatBox>
					<StatLabel>Total Volume DAI</StatLabel>
					<StatValue>{formatDollarAmount(totalVolumeDAI)}</StatValue>
				</StatBox>
				<StatBox>
					<StatLabel>Total Transactions</StatLabel>
					<StatValue>{formatAmount(txCount)}</StatValue>
				</StatBox>
			</BodyWrapper>
		</StatsWrapper>
	)
}
