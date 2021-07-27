import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { debounce } from "lodash"

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
  width: ${({ size }) => (size > 1300) ? '340px' : (size > 1120) ? '250px' : '200px' };
  height: 30px;

  & > * {
    &:last-child {
      margin-top: 10px;
    }
  }
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

  const debounceLoaderScreen = useCallback(debounce(status => {
    setStatus(status)
  }, 1500), [])

  useEffect(() => {
    // debounceLoaderScreen(base.status)
    setStatus(base.status)
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
              <SearchBar isDesktop={width >= 985}/>
            </SearchContainerMobile>
          </HeroContainer>
        </Wrapper>
      </React.Fragment>
    )
  }

  if (status === 'OK') {
    return (
      <React.Fragment>
        {width >= 985 && (
          <SearchContainerDesktop size={width}>
            <SearchBar isDesktop={width >= 985}/>
            <NetworkBar size={width}/>
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
            <SearchBar isDesktop={width >= 985}/>
          </SearchContainerMobile>
        </HeroContainer>
      </Wrapper>
    </React.Fragment>
  )
}
