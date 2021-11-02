import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import { useMarketState } from '../../../state/market/hooks'
import { SUPPORTED_CHAINS_BY_NAME } from '../../../constants'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  padding: 18px 9px;
  background-color: #30315d;
  border-radius: 6px;
`

const Title = styled.div`
  font-size: 15px;
  line-height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #cdcdcd;
  margin-bottom: 11px;
`

const OptionsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 9px;
`

const BoxWrapper = styled.a`
  display: flex;
  justify-content: center;
  height: 22px;
  text-decoration: none;
  text-align: center;
  align-items: center;
  line-height: 22px;
  color: black;
  font-weight: 300;
  border-radius: 3px;

  &:hover {
    cursor: pointer;
  }

  ${(props) =>
    props.active
      ? `
    background: rgba(0, 209, 108, 0.15);
    pointer-events: none;
  `
      : `
    background: rgba(255, 255, 255, 0.7);
  `}
`

const CircleWrapper = styled.div`
  color: green;
  display: flex;
  justify-content: center;
  align-items: center;
`

const GreenCircle = styled.div`
  justify-content: center;
  align-items: center;
  &:first-child {
    height: 8px;
    width: 8px;
    margin-right: 8px;
    background-color: green;
    border-radius: 50%;
  }
`

export const NetworkBar = () => {
  const { networkName } = useMarketState()

  return (
    <Wrapper>
      <Title>CHOOSE CHAIN TO TRADE ON:</Title>
      <OptionsWrapper>
        {Object.keys(SUPPORTED_CHAINS_BY_NAME).map((name) => {
          const displayValue = name === 'MAINNET' ? 'ETH' : name
          const active = name === networkName
          return (
            <Link
              key={name}
              href={{ pathname: '/exchange/simple', query: { network: displayValue } }}
              passHref
              shallow
            >
              <BoxWrapper active={active} href={href}>
                {active &
                (
                  <CircleWrapper>
                    <GreenCircle>
                      <div />
                    </GreenCircle>
                  </CircleWrapper>
                )}
                {displayValue}
              </BoxWrapper>
            </Link>
          )
        })}
      </OptionsWrapper>
    </Wrapper>
  )
}
