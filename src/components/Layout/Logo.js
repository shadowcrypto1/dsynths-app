import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import {
  DSynthsLogo,
  DSynthsText
} from '../Icons'

const Wrapper = styled(Link)`
  display: flex;
  justify-content: flex-start;
  flex-grow: row nowrap;
  align-items: center;
  height: auto;
`

const Text = styled(DSynthsText)`
  height: 25px;
  @media only screen and (max-width: 1000px) {
    display: none;
  }
`

export const Logo = () => {
  return (
    <Wrapper to='/exchange/basic'>
      <DSynthsLogo style={{marginRight: '3px', height: '35px'}}/>
      <Text/>
    </Wrapper>
  )
}
