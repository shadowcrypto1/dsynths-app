import React from 'react'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  height: auto;
  margin: ${({isMobile}) => isMobile ? '10px auto' : '40px auto'};
  width: ${({isMobile}) => isMobile ? '90%' : '50%'};
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
  text-align: center;
`

export default function Privacy () {
  return (
    <Wrapper isMobile={isMobile}>
      <Header>
        Privacy Policy
      </Header>
      <Body>
        <span style={{fontWeight: 'bold'}}>PRIVACY STATEMENT IS UNDER CONSTRUCTION</span>
        <br/>
        In the meantime, any cookie-based tracking activity is disabled or disfunctional.
        <br/>
      </Body>
    </Wrapper>
  )
}
