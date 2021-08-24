import React, { useState, useEffect, useCallback, useLayoutEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import { debounce } from 'lodash'

import {
  Hero,
  SearchBar,
  LongTab,
  ShortTab,
  Trade,
  NetworkBar,
} from '../../components/App/Basic'

import { LogoAsLoader as LoaderIcon } from '../../components/Icons'

import { useBaseState } from '../../state/base/hooks'
import { useWindowSize } from '../../hooks/useWindowSize'

const Container = styled.div`
  display: block;
  position: relative;
  width: 100%:
  height: auto;
  padding: 25px 0px 10px 0px;
`

const Wrapper = styled.div`
  display: block;
  width: clamp(250px, 90%, 512px);
  height: auto;
  margin: 0 auto;
  align-items: center;

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
  height: auto;
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
  right: 30px;
  width: ${({ size }) => (size > 1300) ? '340px' : (size > 1120) ? '250px' : '200px' };
  height: 30px;
`

const SearchContainerMobile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  width: 100%;
  height: auto;
  margin-top: 8px;
`

const TypeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: auto;
`

const TradeContainer = styled.div`
  display: block;
  margin-top: 8px;
  width: 100%;
  height: auto;
  background: #30315D;
  border-radius: 10px;
  padding: 30px;
`

export default function Basic () {
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
    if (process.env.NODE_ENV !== 'production') {
      setStatus(base.status)
    } else {
      debounceLoaderScreen(base.status)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base.status])

  const isDesktop = useMemo(() => {
    return width >= 985
  }, [width])

  if (status === 'LOADING') {
    return (
      <LoaderWrapper>
        <LoaderIcon size={'90px'}/>
      </LoaderWrapper>
    )
  }

  if (status === 'NOT_FOUND') {
    return (
      <Container>
        <Wrapper>
          <HeroContainer>
            <HeroTitle>Stock not found</HeroTitle>
            <HeroSubTitle>Try a different stock or switch networks!</HeroSubTitle>
            <SearchContainerMobile size={width}>
              <SearchBar focus={true}/>
              <NetworkBar style={{marginTop: '8px'}}/>
            </SearchContainerMobile>
          </HeroContainer>
        </Wrapper>
      </Container>
    )
  }

  if (status === 'OK') {
    return (
      <Container>
        {isDesktop ? (
          <>
            <SearchContainerDesktop size={width}>
              <NetworkBar style={{marginBottom: '8px'}}/>
              <SearchBar focus={isDesktop}/>
            </SearchContainerDesktop>
            <Wrapper>
              <HeroContainer>
                <Hero symbol={base.symbol.toUpperCase()} name={base.name} isDesktop={true}/>
              </HeroContainer>
              <TradeContainer>
                <TypeWrapper>
                  <LongTab selected={type === 'LONG'} onClick={() => setType('LONG')}>LONG</LongTab>
                  <ShortTab selected={type === 'SHORT'} onClick={() => setType('SHORT')}>SHORT</ShortTab>
                </TypeWrapper>
                <Trade type={type} />
              </TradeContainer>
            </Wrapper>
          </>
        ) : (
          <Wrapper>
            <HeroContainer>
              <Hero symbol={base.symbol.toUpperCase()} name={base.name} isDesktop={false}/>
            </HeroContainer>
            <SearchContainerMobile size={width}>
              <SearchBar isDesktop={isDesktop}/>
            </SearchContainerMobile>
            <TradeContainer>
              <TypeWrapper>
                <LongTab selected={type === 'LONG'} onClick={() => setType('LONG')}>LONG</LongTab>
                <ShortTab selected={type === 'SHORT'} onClick={() => setType('SHORT')}>SHORT</ShortTab>
              </TypeWrapper>
              <Trade type={type} />
            </TradeContainer>
            <NetworkBar style={{marginTop: '8px'}}/>
          </Wrapper>
        )}
      </Container>
    )
  }

  return (
    <Container>
      <Wrapper>
        <HeroContainer>
          <HeroTitle>Oh oh...</HeroTitle>
          <HeroSubTitle>Something went wrong, please try again later!</HeroSubTitle>
          <SearchContainerMobile size={width}>
            <SearchBar focus={true}/>
          </SearchContainerMobile>
        </HeroContainer>
      </Wrapper>
    </Container>
  )
}
