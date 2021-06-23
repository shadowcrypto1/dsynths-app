import React from 'react'
import styled from 'styled-components'
import { FaBars } from 'react-icons/fa'

import { Footer } from '../Footer'

const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`

const ToggleContainer = styled.div`
  background: #353535;
`

const ToggleWrapper = styled.div`
  cursor: pointer;
  width: 35px;
  height: 35px;
  background: #353535;
  color: #fff;
  text-align: center;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  display: none;

  @media (max-width: 768px) {
    display: flex;
  }
`

const Content = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
`

export const Main = ({ handleToggleSidebar, children }) => {
	return (
		<Wrapper>
			<ToggleContainer>
				<ToggleWrapper onClick={() => handleToggleSidebar(true)}>
					<FaBars />
				</ToggleWrapper>
			</ToggleContainer>
			<Content>
				{children}
			</Content>
			<Footer/>
		</Wrapper>
	)
}
