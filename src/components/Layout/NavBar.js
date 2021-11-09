import React, { useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import _ from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { NavToggle as NavToggleIcon } from '../Icons'
import { Web3Status } from '../Web3Status'
import { NetworkBox } from '../Box'

import { Logo } from './Logo'
import { Dropdown } from './Dropdown'
import { Sidebar } from './Sidebar'

import { useMarketState } from '../../state/market/hooks'
import { SUPPORTED_CHAINS_BY_NAME } from '../../constants'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr auto;
  position: sticky;
  top: 0;
  height: 60px;
  width: 100%;
  z-index: 1;
  padding: 0 30px;
  background: #12092c;
  align-items: center;
`

const NavLinksWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  /* show connect wallet on small devices */
  & > * {
    &:first-child {
      @media only screen and (min-width: 640px) {
        display: none;
      }
    }
    &:not(:first-child) {
      @media only screen and (max-width: 640px) {
        display: none;
      }
    }
  }
`

const NavToggle = styled(NavToggleIcon)`
  display: none;
  align-self: center;

  &:hover {
    cursor: pointer;
  }

  @media only screen and (max-width: 1000px) {
    display: block;
  }
`

const NavItem = styled.a`
  display: flex;
  font-size: 14px;
  line-height: 18px;
  padding: 4px 17px;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;

  &:hover {
    color: #f6cc2e;
  }

  ${({ selected }) =>
    selected &&
    `
    pointer-events: none;
    text-decoration: underline;
    text-decoration-color: #9277E0;
    text-underline-offset: 7px;
    background: radial-gradient(40.87% 40.91% at 50% 72.73%, #200F56 0%, rgba(30, 14, 82, 0.27) 85.42%, rgba(28, 13, 77, 0) 100%);
  `}
`

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media only screen and (max-width: 1000px) {
    display: none;
  }
`

const NavLinks = () => {
  const { pathname } = useRouter()
  return (
    <NavLinksWrapper>
      {/*Web3Status is only visible on smaller devices using media queries*/}
      <Web3Status />
      <Link href="/dashboard" passHref>
        <NavItem selected={pathname === '/dashboard'}>Dashboard</NavItem>
      </Link>
      <Dropdown
        name="Exchange"
        selected={false}
        linksMapping={[
          {
            name: 'Simple',
            href: '/exchange/simple?network=xdai',
          },
          {
            name: 'Basic',
            href: '/exchange/basic?network=xdai',
          },
        ]}
      />
      <Link href="/markets" passHref>
        <NavItem selected={pathname === '/markets'}>Markets</NavItem>
      </Link>
      <Link href="/portfolio" passHref>
        <NavItem selected={pathname === '/portfolio'}>Portfolio</NavItem>
      </Link>
      <Link href="/fiat" passHref>
        <NavItem selected={pathname === '/fiat'}>Fiat</NavItem>
      </Link>
    </NavLinksWrapper>
  )
}

const NavButtons = () => {
  const { chainId } = useWeb3React()
  const { networkName } = useMarketState()
  return (
    <ButtonsWrapper>
      <Web3Status />
      <NetworkBox style={{ marginLeft: '10px' }}>
        {chainId && (
          <div>
            <span style={{ color: '#8A8E9B' }}>Connected Network: </span>
            <span>{_.findKey(SUPPORTED_CHAINS_BY_NAME, (value) => value === chainId) ?? '-'}</span>
          </div>
        )}
        <div>
          <span style={{ color: '#8A8E9B' }}>Viewing Network: </span>
          <span>{networkName}</span>
        </div>
      </NetworkBox>
    </ButtonsWrapper>
  )
}

export const NavBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggleSidebar = (isOpen) => {
    setSidebarOpen((prev) => isOpen ?? !prev)
  }
  return (
    <Wrapper>
      <Logo />
      <NavLinks />
      <NavButtons />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <NavToggle onClick={() => toggleSidebar()} />
      </div>
      <Sidebar toggled={sidebarOpen} handleToggled={toggleSidebar} />
    </Wrapper>
  )
}
