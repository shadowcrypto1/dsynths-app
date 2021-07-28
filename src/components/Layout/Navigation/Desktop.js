import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import _ from 'lodash'

import { DSynthsLogo, DSynthsText, NavToggle } from '../../Icons'
import { Web3Status } from '../../Web3Status'

import { useWindowSize } from '../../../hooks/useWindowSize'
import { useMarketState } from '../../../state/market/hooks'
import { SUPPORTED_CHAINS_BY_NAME } from '../../../constants'

const Wrapper = styled.nav`
  display: grid;
  position: sticky;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  height: 60px;
  background: transparent;
  align-items: center;
  padding: 0px 30px;
`

const LogoWrapper = styled(Link)`
  display: flex;
  justify-content: flex-start;
  flex-grow: row nowrap;
  align-items: center;
  min-width: 200px;
  min-height: 43px;
  &:hover {
    cursor: pointer;
  }
`

const NavWrapper = styled.div`
  display: flex;
  justify-content: center;

  /* remove Home */
  @media only screen and (max-width: 790px) {
    & > *:nth-child(1) {
      display: none;
    }
  }

  /* remove Home + FAQ */
  @media only screen and (max-width: 735px) {
    & > *:nth-child(5) {
      display: none;
    }
  }

  /* remove Home + FAQ + Stats */
  @media only screen and (max-width: 670px) {
    & > *:nth-child(4) {
      display: none;
    }
  }
`

const NavItem = styled(Link)`
  display: flex;
  font-size: 14px;
  line-height: 18px;
  padding: 4px 17px;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;

  ${({ selected}) => selected && `
    pointer-events: none;
    text-decoration: underline;
    text-decoration-color: #9277E0;
    text-underline-offset: 7px;
  `}
`

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const NetworkBox = styled.button`
  width: auto;
  height: 30px;
  background: rgba(91, 96, 204, 0.15);
  border: 1px solid rgba(146, 119, 224, 0.5);
  border-radius: 6px;
  font-size: 10px;
  line-height: 10px;
  align-items: center;
  text-align: left;
  color: #FFFFFF;
  pointer-events: none;
  padding: 0 20px;

  &:hover {
    cursor: pointer;
    background: rgba(91, 96, 204, 0.25);
  }

  @media only screen and (max-width: 920px) {
    display: none;
  }
`

export const DesktopNavbar = ({ handleToggled }) => {
  const { pathname } = useLocation()
  const { chainId } = useWeb3React()
  const { networkName } = useMarketState()
  const size = useWindowSize()

  return (
    <Wrapper>
      <LogoWrapper to='/'>
        <DSynthsLogo style={{marginRight: '6px'}}/>
        <DSynthsText/>
      </LogoWrapper>
      <NavWrapper>
        <NavItem to='/' selected={pathname === '/' || pathname === '/home'}>Home</NavItem>
        <NavItem to='/exchange' selected={pathname === '/exchange'}>Exchange</NavItem>
        {/*<NavItem to='/markets' selected={pathname === '/markets'}>Markets</NavItem>
        <NavItem to='/stats' selected={pathname === '/stats'}>Stats</NavItem>
        <NavItem to='/faq' selected={pathname === '/faq'}>FAQ</NavItem>*/}
      </NavWrapper>
      <ButtonsWrapper>
        <Web3Status/>
        <NetworkBox style={{ marginLeft: '10px' }}>
          <div>
            <span style={{color: '#8A8E9B'}}>Connected Network: </span>
            <span>{_.findKey(SUPPORTED_CHAINS_BY_NAME, (value) => value === chainId) ?? ''}</span>
          </div>
          <div>
            <span style={{color: '#8A8E9B'}}>Viewing Network: </span>
            <span>{networkName}</span>
          </div>
        </NetworkBox>
        {size.width < 920 && (
          <NavToggle style={{ marginLeft: '10px', alignSelf: 'center' }} onClick={() => handleToggled(true)}/>
        )}
      </ButtonsWrapper>
    </Wrapper>
  )
}
