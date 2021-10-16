import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import _ from 'lodash'

import { DSynthsLogo, DSynthsText, NavToggle } from '../../Icons'
import { Web3Status } from '../../Web3Status'
import { NetworkBox } from '../../Box'
import { Notify } from '../../Notify'
import { ChevronDown } from '../../Icons'

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
  z-index: 1;
`

const LogoWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-grow: row nowrap;
  align-items: center;
  min-width: 200px;
  min-height: 43px;
`

const NavWrapper = styled.div`
  display: flex;
  justify-content: center;

  /* remove FAQ + Markets + Stats */
  @media only screen and (max-width: 1000px) {
    & > *:nth-child(n+3):nth-child(-n+5) {
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
    background: radial-gradient(40.87% 40.91% at 50% 72.73%, #200F56 0%, rgba(30, 14, 82, 0.27) 85.42%, rgba(28, 13, 77, 0) 100%);
  `}
`

const DropdownContainer = styled.div`
  float: left;
  overflow: hidden;

  &:hover {
    display: block;
  }
`

const DropdownButton = styled.button`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 18px;
  padding: 4px 17px;
  align-items: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  background: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  font-family: inherit; /* Important for vertical align on mobile phones */
  margin: 0; /* Important for vertical align on mobile phones */

  &:focus {
    outline: none;
  }
`

const DropdownContent = styled.div`
  display: ${props => props.show ? 'block' : 'none'};
  position: absolute;
  width: 150px;
  z-index: 1;

  background: #28116A;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  overflow: hidden;

  & > a {
    float: none;
    color: white;
    padding: 15px;
    text-decoration: none;
    display: block;
    text-align: left;

    &:hover {
      color: #F6CC2E;
      background: #351690;
    }
  }
`

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const Dropdown = () => {
  const [ show, setShow ] = useState(false)
  return (
    <DropdownContainer
      onMouseOver={() => setShow(true)}
      onMouseOut={() => setShow(false)}
    >
      <DropdownButton>
        <span>Exchange</span>
        <ChevronDown width='15' style={{marginLeft: '5px'}}/>
      </DropdownButton>
      <DropdownContent show={show}>
        <Link to="/exchange/simple">Simple</Link>
        <Link to="/exchange/basic">Basic</Link>
      </DropdownContent>
    </DropdownContainer>
  )
}

export const DesktopNavbar = ({ handleToggled }) => {
  const { pathname } = useLocation()
  const { chainId } = useWeb3React()
  const { networkName } = useMarketState()
  const size = useWindowSize()

  return (
    <Wrapper>
      <Link to='/exchange/basic'>
        <LogoWrapper>
          <DSynthsLogo style={{marginRight: '6px'}}/>
          <DSynthsText/>
        </LogoWrapper>
      </Link>
      <NavWrapper>
        <NavItem to='/' selected={pathname === '/dashboard'}>Dashboard</NavItem>
        <Dropdown/>
        <NavItem to='/markets' selected={pathname === '/markets'}>Markets</NavItem>
        <NavItem to='/portfolio' selected={pathname === '/portfolio'}>Portfolio</NavItem>
        <NavItem to='/fiat' selected={pathname === '/fiat'}>Fiat</NavItem>
      </NavWrapper>
      <ButtonsWrapper>
        <Web3Status/>
        <NetworkBox style={{ marginLeft: '10px' }}>
          {chainId && (
            <div>
              <span style={{color: '#8A8E9B'}}>Connected Network: </span>
              <span>{_.findKey(SUPPORTED_CHAINS_BY_NAME, (value) => value === chainId) ?? '-'}</span>
            </div>
          )}
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
