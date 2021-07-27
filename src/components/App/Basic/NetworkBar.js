import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'

import { useRpcChangerCallback } from '../../../hooks/useRpcChangerCallback'
import { SUPPORTED_CHAINS_BY_NAME } from '../../../constants'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  min-height: 80px;
  padding: 18px 9px;

  background-color: rgba(91, 96, 204, 0.15);
  border: 1px solid rgba(146, 119, 224, 0.5);
  border-radius: 6px;
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
  const { chainId } = useWeb3React()
  const rpcChangerCallback = useRpcChangerCallback()

  return (
    <Wrapper >
      <Title>Change Network for more Assets</Title>
      <BoxWrapper>
      {Object.keys(SUPPORTED_CHAINS_BY_NAME).map(name => {
        const displayValue = (name === 'MAINNET') ? 'ETH' : name
        return (
          <Box
            key={name}
            onClick={() => rpcChangerCallback(name)}
            disabled={SUPPORTED_CHAINS_BY_NAME[name] === chainId}
            >{displayValue}
          </Box>
        )
      })}
      </BoxWrapper>
    </Wrapper>
  )
}
