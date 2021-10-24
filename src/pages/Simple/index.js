import React, { useState, useEffect, useCallback, useLayoutEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { debounce } from 'lodash'

import {
  SearchList,
  LongTab,
  ShortTab,
  Trade,
  NetworkBar
} from '../../components/App/Simple'

import { LogoAsLoader as LoaderIcon } from '../../components/Icons'

import { useBaseState } from '../../state/base/hooks'
import { useWindowSize } from '../../hooks/useWindowSize'

const Container = styled.div`
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  justify-content: flex-start;
  width: clamp(100px, 512px, 100%);
  height: auto;
  margin: 30px auto;

  padding: ${({isDesktop}) => isDesktop ? '50px 30px 20px 30px' : '20px 30px 20px 30px'};
`

const LoaderWrapper = styled.div`
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const Disclaimer = styled.div`
  display: block;
  text-align: center;
  font-size: 14px;
  margin: 20px 0;
  & > a {
    text-decoration: none;
    color: green;
  }
`

const TradeContainer = styled.div`
  display: block;
  background: #30315D;
  border-radius: 10px;
  padding: 30px;
  margin-top: 8px;
`

const TypeWrapper = styled.div`
  display: flex;
  flex-direction: row;
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
  height: auto;
  font-size: 15px;
  line-height: 19px;
  align-items: center;
  color: rgba(255, 255, 255, 0.75);
`

export default function Simple () {
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
        <Disclaimer>Our simple swapper is still a work in progress, please use our <Link to='/exchange/basic'>/basic</Link>&nbsp;swapper for an improved trading experience.</Disclaimer>
        <SearchList focus={false}/>
        <TradeContainer>
          <TypeWrapper>
            <LongTab selected={type === 'LONG'} onClick={() => setType('LONG')}>LONG</LongTab>
            <ShortTab selected={type === 'SHORT'} onClick={() => setType('SHORT')}>SHORT</ShortTab>
          </TypeWrapper>
          <Trade type={type} />
        </TradeContainer>
      </Container>
    )
  }

  return (
    <Container isDesktop={isDesktop}>
      <HeroTitle>Stock not found</HeroTitle>
      <HeroSubTitle>Try a different symbol or switch to another chain for more options!</HeroSubTitle>
      <SearchList focus={true}/>
      <NetworkBar/>
    </Container>
  )
}
