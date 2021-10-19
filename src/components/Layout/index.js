import React from 'react'
import styled from 'styled-components'

import { NavBar } from './NavBar'
import { Footer } from './Footer'

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  flex: 1;
  overflow: auto;
  z-index: 0;
`

export const Layout = ({ children }) => {
  return (
    <Wrapper>
      <NavBar/>
      <Content>
        {children}
      </Content >
      <Footer/>
    </Wrapper>
  )
}
