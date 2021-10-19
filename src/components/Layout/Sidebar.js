import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import useOutsideClick from  '../../hooks/useOutsideClick'
import {
  Close as CloseIcon,
  NavDashboard,
  NavExchange,
  NavMarkets,
  NavPortfolio,
  NavFiat,
} from  '../Icons'
import { Web3Status } from '../Web3Status'

const Wrapper = styled.nav`
  display: flex;
  width: clamp(200px, 70vw, 300px);
  flex-flow: column nowrap;
  position: absolute;
  background-color: #12092C;
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

  ${props => props.toggled && `
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
  height: 60px;
  margin-bottom: 30px;
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
`

const NavItem = styled(Link)`
  display: block;
  background: #28116A;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  height: 27px;
  font-size: 13px;
  line-height: 25px;
  display: flex;
  align-items: center;
  color: #FFFFFF;
  margin: 0px 5% 5px 5%;
  padding: 15px;
  text-decoration: none;
  text-overflow: ellipsis;
`

const ReturnContainer = styled.div`
  display: block;
  margin-top: auto;
  margin-bottom: 15px;
  overflow: hidden;
  white-space: nowrap;
`

const ReturnButton = styled.a`
  display: block;
  height: 30px;
  padding: 0px 15px;
  line-height: 30px;
  background: #5630DE;
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
        <Web3Status/>
        <Close onClick={() => handleToggled()}/>
      </Header>
      <NavItems onClick={() => handleToggled()}>

        <NavItemTitle>
          <NavExchange/>
          <span>Exchange</span>
        </NavItemTitle>
        <NavItem to='/exchange/simple'>Simple</NavItem>
        <NavItem to='/exchange/basic'>Basic</NavItem>

        <NavItemTitle>
          <NavDashboard/>
          <span>Dashboard</span>
        </NavItemTitle>
        <NavItem to='/dashboard'>Getting Started</NavItem>

        <NavItemTitle>
          <NavMarkets/>
          <span>Markets</span>
        </NavItemTitle>
        <NavItem to='/markets'>View available instruments</NavItem>

        <NavItemTitle>
          <NavPortfolio/>
          <span>Portfolio</span>
        </NavItemTitle>
        <NavItem to='/portfolio'>Check & Manage your portfolio</NavItem>

        <NavItemTitle>
          <NavFiat/>
          <span>Fiat On-Ramp</span>
        </NavItemTitle>
        <NavItem to='/fiat'>Buy crypto with your creditcard</NavItem>

      </NavItems>

      <ReturnContainer>
        <ReturnButton href='https://www.dsynths.com' target='_blank' rel='noreferrer noopener'>Return to Website</ReturnButton>
      </ReturnContainer>
    </Wrapper>
  )
}
