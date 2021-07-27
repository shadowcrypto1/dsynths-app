import React, { useState } from 'react'
import styled from 'styled-components'

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

const Disclaimer = styled.div`
  display: block;
  position: absolute;
  width: 100%;
  line-height: 20px;
  min-height: 20px;
  font-size: 12px;
  background: rgba(209, 0, 28, 0.5);
  text-align: center;
  align-text: center;
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
        <Disclaimer>This project is still in development, please proceed with caution and preferably use a wallet with little to no balance.</Disclaimer>
				{children}
        <Footer />
			</Main >
      <Sidebar toggled={toggled} handleToggled={handleToggled}/>
		</Wrapper>
	)
}
