import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled(Link)`
  display: flex;
  justify-content: flex-start;
  flex-grow: row nowrap;
  align-items: center;
  height: auto;
`

const Text = styled.img`
  height: 17px;
  @media only screen and (max-width: 1000px) {
    display: none;
  }
`

export const Logo = () => {
  return (
    <Wrapper to='/exchange/basic'>
      <img src='/images/NavLogo.png' style={{marginRight: '10px', height: '30px'}}/>
      <Text src='/images/NavLogoText.png'/>
    </Wrapper>
  )
}
