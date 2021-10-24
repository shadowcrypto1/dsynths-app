import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Modal from 'styled-react-modal'
import styled from 'styled-components'
import ReactImageFallback from 'react-image-fallback'

import { Close as CloseIcon, GoArrow } from '../../Icons'

const StyledModal = Modal.styled`
  display: flex;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(109.2deg, #532EE6 2.09%, #6A3EA6 99.42%);
  width: clamp(200px, 75%, 420px);
  border-radius: 20px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  padding: 15px;
  width: 100%;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  color: #FFFFFF;
  font-size: 20px;
  font-weight: bold;
  line-height: 30px;
  padding-bottom: 5px;
  margin-bottom: 15px;
  border-bottom: 1px solid gray;
  & > div {
    &:first-child {
      display: flex;
      justify-content: flex-start;
      gap: 5px;
    }
  }
`

const Symbol = styled(ReactImageFallback)`
  display: flex;
  width: 30px;
  height: auto;
  margin-left: auto;
  margin-right: auto;
`

const Close = styled(CloseIcon)`
  align-self: center;
  &:hover {
    cursor: pointer;
  }
`

const NetworksWrapper = styled.ul`
  padding: 0;
  list-style-type: none;
  margin-block-end: 0;
`

const Network = styled(Link).attrs({
  type: 'li'
})`
  display: flex;
  width: auto;
  height: 50px;
  margin: 10px 0px;
  padding: 0px 7px;
  align-items: center;
  background: #DEDFEC;
  justify-content: space-between;
  border-radius: 12px;
  font-size: 16px;
  text-decoration: none;
`

const NetworkNameWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 8px;
`

const NetworkLogo = styled.img`
  width: 20px;
  height: 20px;
`

const NetworkName = styled.div`
  color: black;
  font-weight: bold;
`

const LinkWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  color: gray;
  font-size: 10px;
`

export const TradeModal = ({ showModal, toggleModal, symbol, name, networks }) => {
  return (
    <StyledModal
      isOpen={showModal}
      onBackgroundClick={toggleModal}
      onEscapeKeydown={toggleModal}
    >
      <Wrapper>
        <Header>
          <div>
            <Symbol
              src={`/images/tickers/${symbol?.toUpperCase()}.png`}
              fallbackImage={'/images/fallback/ticker.png'}
              alt={`${symbol} asset logo`}
            />
            {name}
          </div>
          <Close onClick={toggleModal}/>
        </Header>
        <p style={{fontSize: '12px', textAlign: 'center'}}>
          Trade <span style={{fontWeight: 'bold'}}>{symbol}</span> on the following {networks.length === 1 ? 'chain' : 'chains'}:
        </p>
        <NetworksWrapper>
          {(networks.length > 0) && networks.map((network, index) => (
            <Network key={index} to={`/exchange/basic?symbol=${symbol}&network=${network}`} target="_parent" rel="noopener noreferrer">
              <NetworkNameWrapper>
                <NetworkLogo src={`/images/networks/${network?.toLowerCase()}.png`}/>
                <NetworkName>{network}</NetworkName>
              </NetworkNameWrapper>
              <LinkWrapper>
                Trade here
                <GoArrow style={{width: '8px', marginLeft: '5px', stroke: 'gray'}}/>
              </LinkWrapper>
            </Network>
          ))}
        </NetworksWrapper>
      </Wrapper>
    </StyledModal>
  )
}
