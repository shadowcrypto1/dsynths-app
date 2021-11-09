import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const Wrapper = styled.a`
  display: flex;
  justify-content: flex-start;
  flex-grow: row nowrap;
  align-items: center;
  height: auto;
`

const Text = styled.img`
  height: 17px;
  @media only screen and (max-width: 1000px) {
    display: none;
  }
`

export const Logo = () => {
  return (
    <Link href="/exchange/basic" passHref>
      <Wrapper>
        <img
          src="/images/NavLogo.png"
          style={{ marginRight: '10px', height: '30px' }}
          alt="dSynths Logo"
        />
        <Text src="/images/NavLogoText.png" />
      </Wrapper>
    </Link>
  )
}
