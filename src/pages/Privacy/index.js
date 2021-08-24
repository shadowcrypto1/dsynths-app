import React from 'react'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  height: auto;
  margin: ${({isMobile}) => isMobile ? '40px auto' : '40px auto'};
  width: ${({isMobile}) => isMobile ? '100%' : '50%'};
  border-radius: 10px;
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  background: linear-gradient(0.32deg, #30315D 0.26%, #30315D 47.94%, rgba(48, 49, 93, 0.86) 61.84%, rgba(48, 49, 93, 0) 99.71%), linear-gradient(109.2deg, #532EE6 2.09%, #6A3EA6 99.42%);
  font-size: 1.5rem;
`

const Body = styled.div`
  padding: 20px;
  color: black;
  background: #DEDFEC;
`

export default function Privacy () {
  return (
    <Wrapper isMobile={isMobile}>
      <Header>
        Privacy Policy
      </Header>
      <Body>
        PLEASE READ THESE TERMS OF SERVICE CAREFULLY.
        <br/><br/>
        dsynths.com (referred to as the “Company”, dSynths, “we”, “our” or “us”) is committed to the protection of your Personal Data and takes the matter of protecting your privacy as high priority.
        <br/><br/><br/>
      </Body>
    </Wrapper>
  )
}
