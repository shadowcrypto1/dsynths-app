import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { DSynthsLogo, NavToggle } from '../../Icons'
import { Web3Status } from '../../Web3Status'
import { useWindowSize } from '../../../hooks/useWindowSize'

const Wrapper = styled.nav`
  display: flex;
  position: sticky;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  background: transparent;
  align-items: center;

  & > *:nth-child(1){
    margin-left: 5px;
    min-width: 60px;
  }
  & > *:nth-child(3){
    margin-right: 5px;
    min-width: 60px;
  }
`

const LogoWrapper = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const MobileNavbar = ({ handleToggled }) => {
  const { pathname } = useLocation()
  const size = useWindowSize()

  return (
    <Wrapper>
      <LogoWrapper to='/'>
        <DSynthsLogo/>
      </LogoWrapper>
      <Web3Status/>
      <NavToggle onClick={() => handleToggled(true)}/>
    </Wrapper>
  )
}
