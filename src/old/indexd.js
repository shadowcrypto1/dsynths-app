import React, { useState, useEffect } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'
import { useWeb3React } from '@web3-react/core'

import {
  LineChart,
  SearchBar,
  LongTab,
  ShortTab,
  Trade,
} from '../../components/App/Exchange'

import { ContractMapping } from '../../constants'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useTicker } from '../../hooks/useTicker'
import { getNetworkName } from '../../utils'

// Since we'd like to use different backgrounds per route, but also have it cover the entire body => this is styled-components way of solving it.
const GlobalStyle = createGlobalStyle`
  body {
    background: radial-gradient(100% 100% at 50% 100%, #66539D 0%, #0B1321 59.9%); // fallback for slow connections
    background: url('/img/background_stars.jpg') no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: clamp(250px, 90%, 512px);
  margin: 0 auto;
  align-items: center;
  justify-content: center;

  &::-webkit-scrollbar {
    display: none;
  }
`

const MidWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: clamp(250px, 90%, 512px);
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
`

const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin-top: 35px;
  overflow-y: hidden;
`

const HeroTitle = styled.div`
  display: block;
  text-align: center;
  height: 38px;
  font-size: 30px;
  line-height: 38px;
  text-transform: uppercase;
  align-items: center;
  color: #FFFFFF;
  text-shadow: 0px 0px 5px rgba(146, 119, 224, 0.7), 0px 0px 5px rgba(146, 119, 224, 0.9);
`
const HeroSubTitle = styled.div`
  display: block;
  text-align: center;
  height: 19px;
  font-size: 15px;
  line-height: 19px;
  align-items: center;
  color: rgba(255, 255, 255, 0.75);
`

const SearchContainerDesktop = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  top: 194px;
  right: 30px;
  width: ${({ size }) => (size > 1220) ? '310px' : (size > 1100) ? '250px' : '200px' };
  height: 30px;
`

const SearchContainerMobile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  margin-top: 18px;
  width: 100%;
  height: auto;
`

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: ${props => props.isDesktop ? '42px' : '20px'};
  width: 100%;
  height: 203px;
`

const TypeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 25px;
  width: 100%;
  height: 35px;
`

const TradeContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  width: 100%;
  height: auto;
`

export default function () {
  const { width } = useWindowSize()
  const { search } = useLocation()
  const { chainId } = useWeb3React()
  const { networkName, wrongNetwork } = getNetworkName(chainId)

  // using symbol as a param so we don't have to puzzle with `ticker`
  let symbol = queryString.parse(search).ticker
  if (!symbol) {
    symbol = 'GME'
    window.history.replaceState(null, '', '/exchange?ticker=GME')
  } else {
    symbol = symbol.toUpperCase()
  }

  const {
    success, // oracle/subgraph success
    loading,
    ticker,
    name,
    longTicker,
    shortTicker,
    longContract,
    shortContract
  } = useTicker(symbol, networkName)

  const [ isLong, setIsLong ] = useState(true)
  const [ inputTicker, setInputTicker ] = useState('DAI')
  const [ outputTicker, setOutputTicker ] = useState(longTicker)
  const [ inputContract, setInputContract ] = useState(ContractMapping[networkName][inputTicker])
  const [ outputContract, setOutputContract ] = useState(longContract)

  useEffect(() => {
    if (isLong) {
      setOutputTicker(longTicker)
      setOutputContract(longContract)
    } else {
      setOutputTicker(shortTicker)
      setOutputContract(shortContract)
    }
  }, [loading, isLong])

  const toggleLong = () => {
    setIsLong(true)
  }

  const toggleShort = () => {
    setIsLong(false)
  }

  if (!success) {
    return (
      <React.Fragment>
        <GlobalStyle/>
        <Wrapper>
          <HeroContainer>
            <HeroTitle>Oh oh...</HeroTitle>
            <HeroSubTitle>Something went wrong!</HeroSubTitle>
          </HeroContainer>
        </Wrapper>
      </React.Fragment>
    )
  }

  if (loading) {
    return (
      <React.Fragment>
        <GlobalStyle/>
        Loading symbol
      </React.Fragment>
    )
  }

  if (!loading && !ticker) {
    return (
      <React.Fragment>
        <GlobalStyle/>
        <Wrapper>
          <HeroContainer>
            <HeroTitle>Stock not found</HeroTitle>
            <HeroSubTitle>Try a different stock or switch to xDAI/Bsc/HECO</HeroSubTitle>
            <SearchContainerMobile size={width}>
              <SearchBar symbol={symbol} isDesktop={width >= 985}/>
            </SearchContainerMobile>
          </HeroContainer>
        </Wrapper>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <GlobalStyle />
      {width >= 985 && (
        <SearchContainerDesktop size={width}>
          <SearchBar symbol={symbol} isDesktop={width >= 985}/>
        </SearchContainerDesktop>
      )}
      <Wrapper>
        <HeroContainer>
          <HeroTitle>{`TRADE ${ticker.toUpperCase()}`}</HeroTitle>
          <HeroSubTitle>{name}</HeroSubTitle>
        </HeroContainer>
        {width < 985 && (
          <SearchContainerMobile size={width}>
            <SearchBar symbol={symbol} isDesktop={width >= 985}/>
          </SearchContainerMobile>
        )}
        <ChartContainer isDesktop={width >= 985}>
          <LineChart symbol={symbol}/>
        </ChartContainer>
        <TypeWrapper>
          <LongTab selected={isLong} onClick={toggleLong}>LONG</LongTab>
          <ShortTab selected={!isLong} onClick={toggleShort}>SHORT</ShortTab>
        </TypeWrapper>
        <TradeContainer>
          <Trade
            networkName={networkName}
            wrongNetwork={wrongNetwork}
            symbol={symbol}
            isLong={isLong}
            inputTicker={inputTicker}
            inputContract={inputContract}
            outputTicker={outputTicker}
            outputContract={outputContract}
          />
        </TradeContainer>
      </Wrapper>
    </React.Fragment>
  )
}
