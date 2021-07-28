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
  justify-content: space-between;
  height: calc(100vh - 110px);
  margin: 0px 8%;
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
  top: 60px;
  left: 60px;
  z-index: 999;
`

const HeroImageMobile = styled(HeroImage)`
  margin-left: 50%;
  transform: translateX(-50%);
  margin-top: 10px;
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

const TradeButton = styled(Link)`
  display: flex;
  text-align: center;
  align-text: center;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  margin-top: 30px;
  width: 175px;
  height: 45px;
  line-height: 45px;
  font-size: 20px;
  color: #FFFFFF;
  background: linear-gradient(90deg, #8354AA 5.14%, #6ED2EA 92.71%);
  border-radius: 20px;
  text-decoration: none;
`

const TradeButtonMobile = styled(TradeButton)`
  width: 100%;
`

export default function () {
  const { width } = useWindowSize()
  return (
    <Wrapper>
        {width > 850 ? (
          <DesktopLandingContainer>
            <DesktopLandingText>
              <HeroTitle
                fontsize={width > 1250 ? '45px' : width > 1050 ? '35px' : '30px'}
              >Trading for Everyone</HeroTitle>
              <HeroSubtitle
                fontsize={width > 1250 ? '16px' : width > 1050 ? '15px' : '16px'}
              >Trade the S&P500, commodities, pre-IPOs and even synthetic DOGEcoin. Screw signing up, simply connect your wallet and start trading without getting fucked by Vladimir.</HeroSubtitle>
              <TradeButton to={'/exchange'}>
                <span>Start Trading</span>
                <ArrowUpRight size={'20px'}/>
              </TradeButton>
            </DesktopLandingText>
            <HeroImageContainer>
              <HeroImage
                src={'/img/home_hero.png'}
                alt={`Home Hero Logo`}
              />
              <HeroImageShadow
                src={'/img/home_hero_shadow.png'}
                alt={`Home Hero Shadow`}
              />
            </HeroImageContainer>
          </DesktopLandingContainer>
        ) : (
          <MobileLandingContainer>
            <HeroTitleMobile>Trading for Everyone</HeroTitleMobile>
            <HeroImageContainer>
              <HeroImageMobile
                src={'/img/home_hero.png'}
                alt={`Home Hero Logo`}
              />
              <HeroImageShadow
                src={'/img/home_hero_shadow.png'}
                alt={`Home Hero Shadow`}
              />
            </HeroImageContainer>
            <HeroSubtitleMobile>
              Trade the S&P500, commodities, pre-IPOs and even synthetic DOGEcoin. Screw signing up, simply connect your wallet and start trading without getting fucked by Vladimir.
            </HeroSubtitleMobile>
            <TradeButtonMobile to={'/exchange'}>
              <span>Start Trading</span>
              <ArrowUpRight size={'20px'}/>
            </TradeButtonMobile>
          </MobileLandingContainer>
        )}
    </Wrapper>
  )
}
