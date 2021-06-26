import React, { Fragment, useState, useEffect } from 'react'
import styled from 'styled-components'

import { ThemeButton } from '../../../Button'
import { formatDollarAmount, formatAmount } from '../../../../utils/numbers'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  justify-content: space-between;
  padding: 5px 10px;
`

const StatRow = styled.div`
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

const StatValue = styled.div``

const BoostedThemeButton = styled(ThemeButton)`
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  font-weight: bold;
`

export const Stats = ({
  ticker,
  toggle,
  totalFeesDAI,
  totalVolumeDAI,
  totalVolumeRegistrar,
  txCount
}) => {
  return (
    <Wrapper>
      <div>
        <StatRow>
          <StatLabel>Total Accrued Fees</StatLabel>
          <StatValue>{formatDollarAmount(totalFeesDAI)}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Total Synth Volume</StatLabel>
          <StatValue>{formatAmount(totalVolumeRegistrar)}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Total Volume DAI</StatLabel>
          <StatValue>{formatDollarAmount(totalVolumeDAI)}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Total Transactions</StatLabel>
          <StatValue>{formatAmount(txCount)}</StatValue>
        </StatRow>
      </div>
      <BoostedThemeButton onClick={toggle}>Trade {ticker}</BoostedThemeButton>
    </Wrapper>
  )
}
