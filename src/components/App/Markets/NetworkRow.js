import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  gap: 8px;
`

const NetworkBox = styled.button`
  display: block;
  padding: 4px;
  min-width: 80px;
  height: 22px;
  text-align: center;
  align-text: center;
  font-size: 12.5px;
  line-height: 12.5px;
  border: 1px solid #20214C;
  border-radius: 6px;
  color: white;
  background: ${props => props.active ? 'linear-gradient(109.2deg, #532EE6 2.09%, #6A3EA6 99.42%)' : '#242657'};

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  ${props => props.isAll && `
    background: #000000;
    border: 1px solid rgba(255, 255, 255, 0.26);
  `}
`

export const NetworkRow = ({ networkMapping, currentNetwork, onNetworkChange }) => {
  return (
    <Wrapper>
      {networkMapping.map((network, index) => {
        const active = network.value === currentNetwork
        return (
          <NetworkBox
            isAll={name.value === 'ALL'}
            active={active}
            onClick={() => onNetworkChange(network.value)}
            key={index}
          >
            {network.name}
          </NetworkBox>
        )
      })}
    </Wrapper>
  )
}
