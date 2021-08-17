import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowUpRight } from 'react-feather'

import { useWindowSize } from '../../hooks/useWindowSize'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  height: auto;
  max-width: 100%;
`

const DesktopLandingContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 40px;
  margin: 130px 15% 200px 15%;
  max-height: 450px;
`

const MobileLandingContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  height: auto;
  margin: 10px 8%;
`

const DesktopLandingText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const HeroImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  max-height: inherit;
`

const HeroImage = styled.img`
  position: relative;
  object-fit: contain;
  max-height: 450px;
  width: 100%;
`

const HeroImageShadow = styled(HeroImage)`
  position: absolute;
  top: 50px;
  left: 50px;
  z-index: 2;
  overflow: hidden;
`

const HeroImageMobile = styled(HeroImage)`
  margin-left: 50%;
  transform: translateX(-50%);
  margin-top: 10px;
  max-height: 250px;
`

const HeroTitle = styled.div`
  font-size: ${props => props.fontsize};
  line-height: ${props => props.fontsize};
  color: #FFFFFF;
  text-shadow: 0px 0px 5px rgba(146, 119, 224, 0.7), 0px 0px 5px rgba(146, 119, 224, 0.9);
`

const HeroTitleMobile = styled.div`
  font-size: 35px;
  line-height: 35px;
  color: #FFFFFF;
  text-shadow: 0px 0px 5px rgba(146, 119, 224, 0.7), 0px 0px 5px rgba(146, 119, 224, 0.9);
  text-align: center;
  margin-top: 50px;
`

const HeroSubtitle = styled.div`
  font-size: ${props => props.fontsize};
  line-height: ${props => props.fontsize};
  color: #FFFFFF;
  height: auto;
  margin-top: 15px;
`

const HeroSubtitleMobile = styled.div`
  font-size: 16px;
  line-height: 1.1em;
  color: #FFFFFF;
  height: auto;
  text-align:justify;
  margin: 25px 0px;
`

const TradeButtonsWrapper = styled.div`
  display: grid;
  grid-template-columns: ${({ width} ) => width < 1350 ? '1fr' : '1fr 1fr'};
  grid-gap: 10px;
  margin-top: 30px;
`

const TradeButton = styled(Link)`
  display: flex;
  text-align: center;
  align-text: center;
  align-items: center;
  justify-content: center;
  padding: 0px 15px;
  line-height: 45px;
  font-size: 18px;
  color: #FFFFFF;
  background: linear-gradient(90deg, #8354AA 5.14%, #6ED2EA 92.71%);
  border-radius: 20px;
  text-decoration: none;
`

const TradeButtonMobile = styled(TradeButton)`
  margin-top: 10px;
  width: 100%;
`

const heroText = "Trade the S&P500, commodities, pre-IPOs and synthetic crypto. You don't have to sign up, simply connect your wallet and start trading! With dSynths, the long button will never be disabled."

export default function Home() {
  const { width } = useWindowSize()
  return (
    <Wrapper>
      {width > 850 ? (
        <DesktopLandingContainer>
          <DesktopLandingText>
            <HeroTitle
              fontsize={width > 1250 ? '55px' : width > 1050 ? '45px' : '40px'}
            >Trading for Everyone</HeroTitle>
            <HeroSubtitle
              fontsize={width > 1250 ? '19px' : width > 1050 ? '17px' : '16px'}
            >{heroText}</HeroSubtitle>
            <TradeButtonsWrapper width={width}>
              <TradeButton to={'/exchange?network=mainnet'}>
                <span>Trade on Ethereum</span>
                <ArrowUpRight size={'20px'}/>
              </TradeButton>
              <TradeButton to={'/exchange?network=xdai'}>
                <span>Trade on xDai</span>
                <ArrowUpRight size={'20px'}/>
              </TradeButton>
            </TradeButtonsWrapper>
          </DesktopLandingText>
          <HeroImageContainer>
            <HeroImage
              src={'/images/home_hero.png'}
              alt={'Trade any type of synthetic asset across multiple chains'}
            />
            <HeroImageShadow
              src={'/images/home_hero_shadow.png'}
            />
          </HeroImageContainer>
        </DesktopLandingContainer>
      ) : (
        <MobileLandingContainer>
          <HeroTitleMobile>Trading for Everyone</HeroTitleMobile>
          <HeroImageContainer>
            <HeroImageMobile
              src={'/images/home_hero.png'}
              alt={'Trade any type of synthetic asset across multiple chains'}
            />
            <HeroImageShadow
              src={'./images/home_hero_shadow.png'}
            />
          </HeroImageContainer>
          <HeroSubtitleMobile>{heroText}</HeroSubtitleMobile>
          <TradeButtonMobile to={'/exchange'}>
            <span>Start Trading</span>
            <ArrowUpRight size={'20px'}/>
          </TradeButtonMobile>
        </MobileLandingContainer>
      )}
    </Wrapper>
  )
}
