import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { DSynthsLogo, NavToggle } from '../../Icons'
// import { MainConnectButton } from '../../../web3/components/MainConnectButton'

import { useWindowSize } from '../../../hooks/useWindowSize'

const Wrapper = styled.nav`
  display: flex;
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

const StyledLogo = styled(DSynthsLogo)`
  min-height: 35px;
`

export const MobileNavbar = ({ handleToggled }) => {
  const { pathname } = useLocation()
  const size = useWindowSize()

  return (
    <Wrapper>
      <StyledLogo/>
      {/*<MainConnectButton/>*/}
      <NavToggle onClick={() => handleToggled(true)}/>
    </Wrapper>
  )
}
