import React, { useState } from 'react'
import styled from 'styled-components'
import CookieConsent from "react-cookie-consent";

import { DesktopNavbar } from './Navigation/Desktop'
import { MobileNavbar } from './Navigation/Mobile'
import { Sidebar } from './Navigation/Sidebar'

import { useWindowSize } from '../../hooks/useWindowSize'

const Wrapper = styled.div`
  display: block;
  height: 100%;
`

const Main = styled.div`
  display: block;
  height: calc(100vh - 70px - 40px);
`

const Footer = styled.div`
  display: block;
  width: 100%;
  height: 40px;
  background: transparent;
`

export const Layout = ({ children }) => {
  const size = useWindowSize()
  const [toggled, setToggled] = useState(false)

  const handleToggled = (state) => {
    setToggled(state)
  }

  return (
    <Wrapper>
      {size.width > 600 && <DesktopNavbar handleToggled={handleToggled}/>}
      {size.width <= 600 && <MobileNavbar handleToggled={handleToggled}/>}
      <Main>
        {children}
        <Footer />
        <CookieConsent debug={false}>This website uses cookies to enhance the user experience.</CookieConsent>
      </Main >
      <Sidebar toggled={toggled} handleToggled={handleToggled}/>
    </Wrapper>
  )
}
