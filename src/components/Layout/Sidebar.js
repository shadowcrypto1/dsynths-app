import React, { useRef } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import useOutsideClick from '../../hooks/useOutsideClick'
import {
  Close as CloseIcon,
  NavDashboard,
  NavExchange,
  NavMarkets,
  NavPortfolio,
  NavFiat,
  Twitter,
  Telegram,
  Github,
} from '../Icons'
import { Web3Status } from '../Web3Status'

const Wrapper = styled.nav`
  display: flex;
  width: clamp(200px, 70vw, 300px);
  flex-flow: column nowrap;
  position: absolute;
  background-color: #12092c;
  top: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  opacity: 0;
  filter: drop-shadow(-2px 0px 10px rgba(255, 255, 255, 0.1));
  padding: 0px 30px;
  transition: all 0.3s;
  -webkit-transition: all 0.3s;
  pointer-events: none;

  ${(props) =>
    props.toggled &&
    `
    opacity: 1;
    pointer-events: auto;
  `};
`

const Close = styled(CloseIcon)`
  min-width: 18px;
  fill: white;
  transition: all 0.5s;
  -webkit-transition: all 0.5s;

  &:hover {
    cursor: pointer;
    transform: rotate(90deg);
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
  margin-bottom: 20px;
`

const NavItems = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  overflow-y: scroll;
  overflow-x: hidden;
  white-space: nowrap;
`

const NavItemTitle = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  margin: 32px 5% 5px 5%;
  align-items: center;
  & > * {
    &:first-child {
      margin-right: 10px;
    }
  }

  @media only screen and (max-width: 600px) {
    margin-top: 20px;
    font-size: 12px;
  }
`

const NavItem = styled.a`
  display: block;
  background: #28116a;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  height: 27px;
  font-size: 13px;
  line-height: 25px;
  display: flex;
  align-items: center;
  color: #ffffff;
  margin: 0px 5% 5px 5%;
  padding: 15px;
  text-decoration: none;
  text-overflow: ellipsis;

  @media only screen and (max-width: 600px) {
    font-size: 11px;
  }
`

const Footer = styled.div`
  display: flex;
  width: 100%;
  flex-flow: column nowrap;
  margin-bottom: 15px;
  overflow: hidden;
  white-space: nowrap;

  @media only screen and (min-width: 767px) {
    margin-top: auto;
  }
`

const SocialsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 10px;
  & > * {
    &:not(:last-child) {
      margin-right: 10px;
    }
  }
`

const ReturnButton = styled.a`
  display: block;
  height: 30px;
  padding: 0px 15px;
  line-height: 30px;
  background: #5630de;
  border-radius: 6px;
  text-align: center;
  text-decoration: none;
  align-text: center;
  color: white;
  text-overflow: ellipsis;
  font-size: 13px;
`

export const Sidebar = ({ toggled, handleToggled }) => {
  const wrapperRef = useRef(null)
  useOutsideClick(wrapperRef, () => {
    handleToggled(false)
  })

  return (
    <Wrapper ref={wrapperRef} toggled={toggled}>
      <Header>
        <Web3Status />
        <Close onClick={() => handleToggled()} />
      </Header>
      <NavItems onClick={() => handleToggled()}>
        <NavItemTitle>
          <NavExchange />
          <span>Exchange</span>
        </NavItemTitle>
        <Link href="/exchange/simple?network=xdai" passHref>
          <NavItem>Simple</NavItem>
        </Link>
        <Link href="/exchange/basic?network=xdai" passHref>
          <NavItem>Basic</NavItem>
        </Link>

        <NavItemTitle>
          <NavDashboard />
          <span>Dashboard</span>
        </NavItemTitle>
        <Link href="/dashboard" passHref>
          <NavItem>Getting Started</NavItem>
        </Link>

        <NavItemTitle>
          <NavMarkets />
          <span>Markets</span>
        </NavItemTitle>
        <Link href="/markets" passHref>
          <NavItem>View available instruments</NavItem>
        </Link>

        <NavItemTitle>
          <NavPortfolio />
          <span>Portfolio</span>
        </NavItemTitle>
        <Link href="/portfolio" passHref>
          <NavItem>Check & Manage your portfolio</NavItem>
        </Link>

        <NavItemTitle>
          <NavFiat />
          <span>Fiat On-Ramp</span>
        </NavItemTitle>
        <Link href="/fiat" passHref>
          <NavItem>Buy crypto with your creditcard</NavItem>
        </Link>
      </NavItems>

      <Footer>
        <SocialsWrapper>
          <a href={'https://twitter.com/dsynths'} target={'_blank'} rel="noreferrer noopener">
            <Twitter size={18} />
          </a>
          <a href={'https://t.me/dsynths'} target={'_blank'} rel="noreferrer noopener">
            <Telegram size={18} />
          </a>
          <a href={'https://github.com/dsynths'} target={'_blank'} rel="noreferrer noopener">
            <Github size={20} />
          </a>
        </SocialsWrapper>
        <ReturnButton href="https://www.dsynths.com" target="_blank" rel="noreferrer noopener">
          Return to Website
        </ReturnButton>
      </Footer>
    </Wrapper>
  )
}
