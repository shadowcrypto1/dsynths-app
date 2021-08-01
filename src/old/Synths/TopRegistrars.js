import React, { Fragment } from 'react'
import styled from 'styled-components'

import { Card } from '../../Card'
import { LinkButton } from '../../Button'

import { useTopRegistrars } from '../../../hooks/useTopRegistrars'

const Wrapper = styled(Card)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px;
`
export const TopRegistrars = ({ ticker }) => {
  const topRegistrars = useTopRegistrars()
  const mappedTopRegistrars = topRegistrars.reduce((acc, obj) => {
    const tickerOnly = obj.symbol.split('-').shift(0).substring(1) // dGME-L becomes GME and dLBS becomes LBS
    if (acc.includes(tickerOnly)) return acc
    acc.push(tickerOnly)
    return acc
  }, [])
  return (
    <Wrapper>
      {mappedTopRegistrars.length >= 1 && mappedTopRegistrars.map((symbol, index) => {
        return (
          <LinkButton
            key={index}
            selected={symbol === ticker.toUpperCase()}
            to={`classic?ticker=${symbol}`}
          >
            {symbol}
          </LinkButton>
        )
      })}
    </Wrapper>
  )
}
