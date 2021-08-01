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

import { formatTime } from '../../../../utils/date'
import { getSymbolVariants } from '../../../../utils/registrars'
import { formatDollarAmount, formatAmount } from '../../../../utils/numbers'
import { isAddress } from '../../../../web3/utils/account'
import { getTransactionsForAccount } from '../../../../web3/apollo/controllers'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: repeat(5, 1fr);
  @media screen and (max-width: 800px) {
    grid-template-columns: repeat(4, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: repeat(3, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
  }
`

export const AccountBalance = ({ ticker }) => {
  return (
  // No Card: should be provided by parent
    <AutoColumn gap="8px">
      <ResponsiveGrid>
        <HeaderItem>Ticker</HeaderItem>
        <HeaderItem>Direction</HeaderItem>
        <HeaderItem>Balance</HeaderItem>
        <HeaderItem>Value</HeaderItem>
        <HeaderItem>Action</HeaderItem>
      </ResponsiveGrid>
      <Break />
      <Fragment>
        <FullRow />
        <FullRow>Coming Soon</FullRow>
      </Fragment>
    </AutoColumn>
  )
}
