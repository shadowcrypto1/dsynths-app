import React, { Fragment, useState, useEffect } from 'react'
import styled from 'styled-components'
import { ExternalLink } from 'react-external-link'
import { useWeb3React } from '@web3-react/core'

import { Break } from '../../../Break'
import {
	AutoColumn,
	HeaderItem,
	TableText,
	FullRow,
	WrappedLoader,
} from './Components'

import { isAddress } from '../../../../utils/account'
import { formatTime } from '../../../../utils/date'
import { getSymbolVariants } from '../../../../utils/registrars'
import { formatDollarAmount, formatAmount } from '../../../../utils/numbers'
import { getTransactionsForAccount } from '../../../../web3/apollo/controllers'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: repeat(7, 1fr);
  @media screen and (max-width: 940px) {
    grid-template-columns: repeat(6, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
  }
  @media screen and (max-width: 800px) {
    grid-template-columns: repeat(4, 1fr);
    & > *:nth-child(6) {
      display: none;
    }
    & > *:nth-child(5) {
      display: none;
    }
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(3, 1fr);
    & > *:nth-child(6) {
      display: none;
    }
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
  }
`

const DataRow = ({ transaction }) => {
	const { id, timestamp, method, feeAmount, registrarSymbol: symbol } = transaction
	const registrarAmount = Math.abs(transaction.registrarAmount)
	const collateralAmount = Math.abs(transaction.collateralAmount)

	let splitSymbol = symbol.split('-') // dGME-L => [dGME, L]
	const ticker = splitSymbol[0].substring(1) // [ dGME, L] => GME
	const direction = splitSymbol[1]

	let eventName
	if (method === 'buy' && direction === 'L') {
		eventName = 'Open Long'
	} else if (method === 'buy' && direction === 'S') {
		eventName = 'Open Short'
	} else if (method === 'sell' && direction === 'L') {
		eventName = 'Close Long'
	} else {
		eventName = 'Close Short'
	}

	return (
		<ResponsiveGrid>
			<TableText >
				{eventName}
			</TableText>
			<TableText >
				{`${formatAmount(registrarAmount)} ${ticker}`}
			</TableText>
			<TableText >
				{`${formatDollarAmount(collateralAmount / registrarAmount)}`}
			</TableText>
			<TableText >
				{`${formatDollarAmount(collateralAmount)}`}
			</TableText>
			<TableText >
				{`${formatDollarAmount(feeAmount)}`}
			</TableText>
			<TableText >
				{formatTime(timestamp)}
			</TableText>
			<TableText >
				<ExternalLink href={`https://etherscan.io/tx/${id}`}>
          Hash
				</ExternalLink>
			</TableText>
		</ResponsiveGrid>
	)
}

export const AccountHistory = ({ ticker }) => {
	const { active, account } = useWeb3React()

	const [ tableText, setTableText ] = useState('')
	const [ loading, setLoading ] = useState(true)
	const [ transactions, setTransactions ] = useState([])

	useEffect(() => {
		fetchTransactions(ticker)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active, account, ticker])

	const fetchTransactions = async (ticker) => {
		const symbolMapping = getSymbolVariants(ticker, 'stock')
		try {
			const isValidAccount = isAddress(account) // check, else GraphQL throws a Bytes error
			if (active && isValidAccount) {
				let data = await getTransactionsForAccount(account, symbolMapping, 10)
				setTransactions(data)
				setLoading(false)
				if (!data.length) setTableText('No transactions found')
			} else {
				setTransactions([])
				setLoading(false)
				setTableText('Connect with your wallet to view your trading history')
			}
		} catch (err) {
			console.error(err)
			setTransactions([])
		}
	}

	if (loading) return <WrappedLoader />

	return (
		// No Card: should be provided by parent
		<AutoColumn gap="8px">
			<ResponsiveGrid>
				<HeaderItem>Action</HeaderItem>
				<HeaderItem>Amount</HeaderItem>
				<HeaderItem>Price [DAI]</HeaderItem>
				<HeaderItem>Total [DAI]</HeaderItem>
				<HeaderItem>Fees Paid</HeaderItem>
				<HeaderItem>Age</HeaderItem>
				<HeaderItem>Tx Hash</HeaderItem>
			</ResponsiveGrid>
			<Break />
			{(transactions && transactions.length) ? transactions.map((tx, index) => (
				<Fragment key={index}>
					<DataRow transaction={tx} />
					<Break />
				</Fragment>
			)) : (
				<Fragment>
					<FullRow />
					<FullRow>{tableText}</FullRow>
				</Fragment>
			)}
			{/* TODO: add pagination*/}
		</AutoColumn>
	)
}
