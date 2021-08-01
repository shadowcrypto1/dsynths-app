import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { DSynthsLogo, NavToggle } from '../../Icons'
import { Web3Status } from '../../Web3Status'

const Wrapper = styled.nav`
  display: flex;
  position: sticky;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  background: transparent;
  align-items: center;

  & > *:nth-child(1){
    min-width: 60px;
  }
  & > *:nth-child(3){
    min-width: 60px;
  }
`

const LogoWrapper = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const MobileNavbar = ({ handleToggled }) => {
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
