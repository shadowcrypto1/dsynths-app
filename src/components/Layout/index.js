import React, { useState } from 'react'
import styled from 'styled-components'
import { getCookieConsentValue } from "react-cookie-consent"

import { NavBar } from './NavBar'
import { Footer } from './Footer'
import { CookieConsent } from '../CookieConsent'

import { useWindowSize } from '../../hooks/useWindowSize'

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
  const { width } = useWindowSize()
  const [showFooter, setShowFooter] = useState(!!getCookieConsentValue())
  const onAccept = () => {
    setShowFooter(true)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .btn:hover {
          cursor: pointer;
        }
      `}} />
      <Wrapper>
        <NavBar/>
        <Content isDesktop={width > 600}>
          {children}
        </Content >
        {showFooter && <Footer />}
      </Wrapper>
      <CookieConsent onAccept={onAccept}/>
    </>
  )
}
