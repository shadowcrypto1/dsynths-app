import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

import { useMarketState } from '../../../state/market/hooks'
import { SUPPORTED_CHAINS_BY_NAME } from '../../../constants'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: auto;
  padding: 18px 9px;

  background-color: rgba(91, 96, 204, 0.15);
  border: 1px solid rgba(146, 119, 224, 0.5);
  border-radius: 6px;
  margin-top: 10px;
`

const Title = styled.div`
  font-size: 15px;
  line-height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #CDCDCD;
  margin-bottom: 11px;
`

const BoxWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 9px;
`

const Box = styled.div`
  height: 22px;
  text-align: center;
  align-text: center;
  line-height: 22px;
  background: #FFFFFF;
  color: black;
  font-weight: 300;
  border-radius: 3px;

  &:hover {
    cursor: pointer;
  }

  ${props => props.disabled && `
    background: rgba(255, 255, 255, 0.36);
    pointer-events: none;
  `}
`

export const NetworkBar = () => {
  const { location } = useHistory()
  const { networkName } = useMarketState()

  return (
    <Wrapper>
      <Title>View Assets on Network: </Title>
      <BoxWrapper>
        {Object.keys(SUPPORTED_CHAINS_BY_NAME).map(name => {
          const displayValue = (name === 'MAINNET') ? 'ETH' : name
          const disabled = name === networkName
          return (
            <Box
              key={name}
              disabled={disabled}
              onClick={() => window.location.href=`${location.pathname}?network=${displayValue}`}
            >{displayValue}
            </Box>
          )
        })}
      </BoxWrapper>
    </Wrapper>
  )
}
