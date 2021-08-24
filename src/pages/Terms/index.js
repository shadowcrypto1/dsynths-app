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

export default function Terms () {
  return (
    <Wrapper isMobile={isMobile}>
      <Header>
        TERMS OF SERVICE
      </Header>
      <Body>
        PLEASE READ THESE TERMS OF SERVICE CAREFULLY.
        <br/><br/>
        BY ACCESSING OR USING OUR SERVICES, YOU AGREE TO BE BOUND BY THESE TERMS OF SERVICE AND ALL TERMS INCORPORATED BY REFERENCE.
        <br/><br/>
        These Terms of Service and any terms expressly incorporated herein (“Terms”) apply to your access to and use of all services (our “Services”) provided by dsynths.com (“Company,” “we,” or “us”).
        <br/><br/><br/>

        <span style={{fontWeight: 'bold'}}>1. COOKIE STATEMENT</span>
        <br/>

        This site uses cookies. Cookies are small text files that are placed on your computer by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site. Cookies are typically stored on your computer's hard drive.
        <br/><br/>

        Information collected from cookies is used by us to evaluate the effectiveness of our Site, analyze trends, and manage the platform. The information collected from cookies allows us to determine such things as which parts of our Site are most visited and difficulties our visitors may experience in accessing our Site. With this knowledge, we can improve the quality of your experience on the platform by recognizing and delivering more of the most desired features and information, as well as by resolving access difficulties. We also use cookies and/or a technology known as web bugs or clear gifs, which are typically stored in emails to help us confirm your receipt of, and response to, our emails and to provide you with a more personalized experience when using our Site.
        <br/><br/>

        We also use third party service provider(s), to assist us in better understanding the use of our Site. Our service provider(s) will place cookies on the hard drive of your computer and will receive information that we select that will educate us on such things as how visitors navigate around our site, what pages are browsed and general transaction information. Our service provider(s) analyses this information and provides us with aggregate reports. The information and analysis provided by our service provider(s) will be used to assist us in better understanding our visitors' interests in our Site and how to better serve those interests. The information collected by our service provider(s) may be linked to and combined with information that we collect about you while you are using the platform. Our service provider(s) is/are contractually restricted from using information they receive from our Site other than to assist us.
        <br/><br/>

        Your continued use of this site, as well as any subsequent usage, will be interpreted as your consent to cookies being stored on your device.
        <br/><br/><br/>

        <span style={{fontWeight: 'bold'}}>2. PRIVACY POLICY</span>
        <br/>
        Please see our detailed Privacy Policy.
      </Body>
    </Wrapper>
  )
}
