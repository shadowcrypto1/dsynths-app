import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { getCookieConsentValue } from "react-cookie-consent"

import { DesktopNavbar } from './Navigation/Desktop'
import { MobileNavbar } from './Navigation/Mobile'
import { Sidebar } from './Navigation/Sidebar'
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
`

export const Layout = ({ children }) => {
  const size = useWindowSize()
  const [toggled, setToggled] = useState(false)
  const [showFooter, setShowFooter] = useState(!!getCookieConsentValue())

  const handleToggled = (state) => {
    setToggled(state)
  }

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
        {size.width > 600 && <DesktopNavbar handleToggled={handleToggled}/>}
        {size.width <= 600 && <MobileNavbar handleToggled={handleToggled}/>}
        <Content isDesktop={size.width > 600}>{children}</Content >
        {showFooter && <Footer />}
        <Sidebar toggled={toggled} handleToggled={handleToggled}/>
      </Wrapper>
      <CookieConsent onAccept={onAccept}/>
    </>
  )
}
