import React from 'react'
import styled from 'styled-components'

import { ThemeToggle } from '../../ThemeToggle'
import { ConnectButton } from '../../../web3/components/ConnectButton'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  overflow: hidden;
`

export const Footer = () => {
	return (
		<Wrapper>
			<ThemeToggle />
			<ConnectButton />
		</Wrapper>
	)
}
