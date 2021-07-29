import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import { debounce } from 'lodash'

import {
  LineChart,
  SearchBar,
  LongTab,
  ShortTab,
  Trade,
  NetworkBar,
} from '../../components/App/Basic'

import { LogoAsLoader as LoaderIcon } from '../../components/Icons'

import { useBaseState } from '../../state/base/hooks'
import { useWindowSize } from '../../hooks/useWindowSize'

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

const LoaderWrapper = styled.div`
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin-top: 35px;
  overflow-y: hidden;
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
  width: ${({ size }) => (size > 1300) ? '340px' : (size > 1120) ? '250px' : '200px' };
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
  const base = useBaseState()
  const [ type, setType ] = useState('LONG')
  const [ status, setStatus ] = useState('LOADING')
  const mounted = useRef(false)

  useLayoutEffect(() => {
    mounted.current = true
    return () => (mounted.current = false)
  }, [])

  const debounceLoaderScreen = useCallback(debounce(status => {
    mounted.current && setStatus(status)
  }, 1500), [mounted, setStatus])

  useEffect(() => {
    // debounceLoaderScreen(base.status)
    setStatus(base.status)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base.status])

  if (status === 'LOADING') {
    return (
      <React.Fragment>
        <LoaderWrapper>
          <LoaderIcon size={'90px'}/>
        </LoaderWrapper>
      </React.Fragment>
    )
  }

  if (status === 'NOT_FOUND') {
    return (
      <React.Fragment>
        <Wrapper>
          <HeroContainer>
            <HeroTitle>Stock not found</HeroTitle>
            <HeroSubTitle>Try a different stock or switch networks!</HeroSubTitle>
            <SearchContainerMobile size={width}>
              <SearchBar focus={true}/>
              <NetworkBar/>
            </SearchContainerMobile>
          </HeroContainer>
        </Wrapper>
      </React.Fragment>
    )
  }

  if (status === 'OK') {
    return (
      <React.Fragment>
        <Disclaimer>This project is still in development, please proceed with caution and preferably use a wallet with little to no balance.</Disclaimer>
        {width >= 985 && (
          <SearchContainerDesktop size={width}>
            <SearchBar focus={width >= 985}/>
            <NetworkBar/>
          </SearchContainerDesktop>
        )}
        <Wrapper>
          <HeroContainer>
            <HeroTitle>{`TRADE ${base.symbol.toUpperCase()}`}</HeroTitle>
            <HeroSubTitle>{base.name}</HeroSubTitle>
          </HeroContainer>
          {width < 985 && (
            <SearchContainerMobile size={width}>
              <SearchBar isDesktop={width >= 985}/>
            </SearchContainerMobile>
          )}
          <ChartContainer isDesktop={width >= 985}>
            <LineChart baseSymbol={base.symbol}/>
          </ChartContainer>
          <TypeWrapper>
            <LongTab selected={type === 'LONG'} onClick={() => setType('LONG')}>LONG</LongTab>
            <ShortTab selected={type === 'SHORT'} onClick={() => setType('SHORT')}>SHORT</ShortTab>
          </TypeWrapper>
          <TradeContainer>
            <Trade
              type={type}
            />
          </TradeContainer>
        </Wrapper>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Wrapper>
        <HeroContainer>
          <HeroTitle>Oh oh...</HeroTitle>
          <HeroSubTitle>Something went wrong, please try again later!</HeroSubTitle>
          <SearchContainerMobile size={width}>
            <SearchBar focus={true}/>
          </SearchContainerMobile>
        </HeroContainer>
      </Wrapper>
    </React.Fragment>
  )
}
