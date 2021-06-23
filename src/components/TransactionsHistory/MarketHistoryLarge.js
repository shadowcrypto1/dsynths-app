import React, { Fragment, useState, useEffect } from 'react'
import styled from 'styled-components'
import { ExternalLink } from 'react-external-link';

import { Break } from "../Break";

import {
  Card,
  Row,
  Loader,
  AutoColumn,
  HeaderItem,
  TableText,
  FullRow,
  Wrapper,
  WrappedLoader,
} from "./components";

import { truncateAddress } from '../../utils/account';
import { formatTime } from '../../utils/date';
import { getSymbolVariants } from "../../utils/registrars";
import { formatDollarAmount, formatAmount } from '../../utils/numbers'
import { getTransactions } from '../../web3/apollo/controllers';

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
  const { id, timestamp, block, method, from, feeAmount, registrarSymbol: symbol } = transaction
  const registrarAmount = Math.abs(transaction.registrarAmount)
  const registrarSymbol = symbol
  const collateralAmount = Math.abs(transaction.collateralAmount)

  let splitSymbol = symbol.split('-') // dGME-L => [dGME, L]
  const ticker = splitSymbol[0].substring(1) // [ dGME, L] => GME
  const direction = splitSymbol[1]

  let eventName;
  if (method === 'buy' && direction === "L") {
    eventName = "Open Long"
  } else if (method === "buy" && direction === "S") {
    eventName = "Open Short"
  } else if (method === "sell" && direction === "L") {
    eventName = "Close Long"
  } else {
    eventName = "Close Short"
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
        <ExternalLink href={`https://etherscan.io/address/${from}`}>
          {truncateAddress(from)}
        </ExternalLink>
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

export const MarketHistoryLarge = ({ ticker }) => {
  const [ loading, setLoading ] = useState(true)
  const [ transactions, setTransactions ] = useState([])

  useEffect(() => {
    fetchTransactions(ticker)
  }, [ticker])

  const fetchTransactions = async (ticker) => {
    const symbolMapping = getSymbolVariants(ticker, 'stock')
    try {
      let data = await getTransactions(symbolMapping, 10)
      setTransactions(data)
      setLoading(false)
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
        <HeaderItem>Account</HeaderItem>
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
        <React.Fragment>
          <FullRow />
          <FullRow>No transactions found</FullRow>
        </React.Fragment>
      )}
      {/* TODO: add pagination*/}
    </AutoColumn>
  )
}
