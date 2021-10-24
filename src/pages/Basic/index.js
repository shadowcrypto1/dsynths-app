import React, { useState, useEffect, useCallback, useLayoutEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import { debounce } from 'lodash'

import {
  Hero,
  SearchList,
  LongTab,
  ShortTab,
  Trade,
  NetworkBar,
} from '../../components/App/Basic'

import { LogoAsLoader as LoaderIcon } from '../../components/Icons'
import { FluidGrid } from '../../components/FluidGrid'

import { useBaseState } from '../../state/base/hooks'
import { useWindowSize } from '../../hooks/useWindowSize'

const Container = styled.div`
  display: block;
  position: relative;
  height: auto;

  padding: ${({isDesktop}) => isDesktop ? '50px 30px 20px 30px' : '20px 30px 20px 30px'};
`

const CenterWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  width: clamp(100px, 512px, 100%);
  height: auto;

  & > * {
    &:not(:last-of-type){
      margin-bottom: 8px;
    }
  }
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
  background: #30315D;
  border-radius: 10px;
  padding: 30px;
`

const RightContainer = styled.div`
  display: flex;
  position: relative;
  justify-content: flex-end;
  padding-left: 8px;
  height: 100%;
`

// special wrapper for responsiveness (instead of using the RightContainer)
const RightWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  width: 340px;
  height: 100%;

  & > * {
    &:not(:first-child) {
      margin-top: 8px;
      height: 100%;
    }
  }
`

const LoaderWrapper = styled.div`
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  height: auto;
  font-size: 15px;
  line-height: 19px;
  align-items: center;
  color: rgba(255, 255, 255, 0.75);
`

const CenterContent = ({isDesktop, base, type, setType}) => {
  return (
    <CenterWrapper>
      <Hero symbol={base.symbol.toUpperCase()} name={base.name} isDesktop={isDesktop}/>
      {!isDesktop && <SearchList focus={false}/>}
      <TradeContainer>
        <TypeWrapper>
          <LongTab selected={type === 'LONG'} onClick={() => setType('LONG')}>LONG</LongTab>
          <ShortTab selected={type === 'SHORT'} onClick={() => setType('SHORT')}>SHORT</ShortTab>
        </TypeWrapper>
        <Trade type={type} />
      </TradeContainer>
    </CenterWrapper>
  )
}

const RightContent = () => {
  return (
    <RightContainer>
      <RightWrapper>
        <NetworkBar/>
        <SearchList focus={true}/>
      </RightWrapper>
    </RightContainer>
  )
}

const NotFound = () => {
  return (
    <CenterWrapper>
      <HeroTitle>Stock not found</HeroTitle>
      <HeroSubTitle>Try a different symbol or switch to another chain for more options!</HeroSubTitle>
      <SearchList focus={true}/>
      <NetworkBar/>
    </CenterWrapper>
  )
}

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
    return width >= 1070
  }, [width])

  if (status === 'LOADING') {
    return (
      <LoaderWrapper>
        <LoaderIcon size={'90px'}/>
      </LoaderWrapper>
    )
  }

  if (status === 'OK') {
    return (
      <Container isDesktop={isDesktop}>
        <FluidGrid
          leftChild={<div/>}
          centerChild={<CenterContent
            isDesktop={isDesktop}
            base={base}
            type={type}
            setType={setType}
          />}
          rightChild={isDesktop ? <RightContent/> : <div/>}
          centerWidth={'512px'}
        />
      </Container>
    )
  }

  return (
    <Container isDesktop={isDesktop}>
      <FluidGrid
        leftChild={<div/>}
        centerChild={<NotFound/>}
        rightChild={<div/>}
        centerWidth={'512px'}
      />
    </Container>
  )
}
