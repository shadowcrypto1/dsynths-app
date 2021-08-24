import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import CookieConsent, { Cookies, getCookieConsentValue } from "react-cookie-consent"

import { DesktopNavbar } from './Navigation/Desktop'
import { MobileNavbar } from './Navigation/Mobile'
import { Sidebar } from './Navigation/Sidebar'
import { Footer } from './Footer'

import { useWindowSize } from '../../hooks/useWindowSize'

const Wrapper = styled.div`
  display: block;
  height: 100%;
`

const Main = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  justify-content: center;
  padding: ${({isDesktop}) => isDesktop ? '35px 0 50px 0' : '5px 0 50px 0'};
`

const CookieBanner = {
  display: 'flex',
  position: 'fixed',
  bottom: 0,
  left: 0,
  justifyContent: 'center',
  alignItems: 'center',
  background: '#FFFFFF',
  margin: '15px',
  width: 'calc(100% - 30px)',
  height: 'auto',
  borderRadius: '8px',
  padding: '12px',
}

const ContentStyle = {
  marginRight: '10px',
  color: '#000000',
  fontSize: '0.9rem',
}

const ButtonStyle = {
  minHeight: '25px',
  minWidth: '70px',
  background: '#5B40A8',
  alignText: 'center',
  outline: 'none',
  borderRadius: '6px',
  color: '#FFFFFF',
  border: 'none',
}

const Anchor = styled(Link)`
  text-decoration: none;
  color: #5B40A8;
`

export const Layout = ({ children }) => {
  const size = useWindowSize()
  const [toggled, setToggled] = useState(false)
  const [showFooter, setShowFooter] = useState(!!getCookieConsentValue())

  const handleToggled = (state) => {
    setToggled(state)
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
        <Main isDesktop={size > 600}>
          {children}
          {showFooter && <Footer />}
          <CookieConsent
            debug={true}
            disableStyles={true}
            style={CookieBanner}
            contentStyle={ContentStyle}
            buttonStyle={ButtonStyle}
            buttonText={'Got it'}
            buttonClasses={'btn'}
            onAccept={() => setShowFooter(true)}
          >
            This website
            <Anchor to={'/terms'} >&nbsp;uses cookies to improve your experience&nbsp;</Anchor>
            and has an
            <Anchor to={'/privacy'} >&nbsp;updated Privacy Policy.&nbsp;</Anchor>
          </CookieConsent>
        </Main >
        <Sidebar toggled={toggled} handleToggled={handleToggled}/>
      </Wrapper>
    </>
  )
}
