import React from 'react'
import styled from 'styled-components'

import { NavBar } from './NavBar'
import { Footer } from './Footer'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  flex: 1;
  overflow-y: scroll;
  z-index: 0;
  margin-bottom: 40px;

  @media only screen and (max-width: 767px) {
    margin-bottom: 0;
  }
`

export const Layout = ({ children }) => {
  return (
    <Wrapper>
      <NavBar />
      <Content>{children}</Content>
      <Footer />
    </Wrapper>
  )
}
