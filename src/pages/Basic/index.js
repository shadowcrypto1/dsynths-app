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
import { FluidGrid } from '../../components/FluidGrid'

import { useBaseState } from '../../state/base/hooks'
import { useWindowSize } from '../../hooks/useWindowSize'

const Container = styled.div`
  display: block;
  position: relative;
  height: auto;
  padding: 50px 30px 20px 30px;
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
`

const RightWrapper = styled.div`
  width: 340px;
  margin-left: 8px;
`

const CenterContent = ({isDesktop, base, type, setType}) => {
  return (
    <CenterWrapper>
      <Hero symbol={base.symbol.toUpperCase()} name={base.name} isDesktop={isDesktop}/>
      {!isDesktop && <SearchBar focus={false}/>}
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
        <NetworkBar style={{marginBottom: '8px'}}/>
        <SearchBar focus={true}/>
      </RightWrapper>
    </RightContainer>
  )
}

const LoaderWrapper = styled.div`
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
      <Container>
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

  // if (status === 'NOT_FOUND') {
  //   return (
  //     <Container>
  //       <Wrapper>
  //         <HeroContainer>
  //           <HeroTitle>Stock not found</HeroTitle>
  //           <HeroSubTitle>Try a different stock or switch networks!</HeroSubTitle>
  //           <SearchContainerMobile size={width}>
  //             <SearchBar focus={true}/>
  //             <NetworkBar style={{marginTop: '8px'}}/>
  //           </SearchContainerMobile>
  //         </HeroContainer>
  //       </Wrapper>
  //     </Container>
  //   )
  // }

  //     <Container>
  //       {isDesktop ? (
  //       ) : (
  //         <Wrapper>
  //           <HeroContainer>
  //             <Hero symbol={base.symbol.toUpperCase()} name={base.name} isDesktop={false}/>
  //           </HeroContainer>
  //           <SearchContainerMobile size={width}>
  //             <SearchBar isDesktop={isDesktop}/>
  //           </SearchContainerMobile>
  //           <TradeContainer>
  //             <TypeWrapper>
  //               <LongTab selected={type === 'LONG'} onClick={() => setType('LONG')}>LONG</LongTab>
  //               <ShortTab selected={type === 'SHORT'} onClick={() => setType('SHORT')}>SHORT</ShortTab>
  //             </TypeWrapper>
  //             <Trade type={type} />
  //           </TradeContainer>
  //           <NetworkBar style={{marginTop: '8px'}}/>
  //         </Wrapper>
  //       )}
  //     </Container>
  //   )
  // }

  return null

  // return (
  //   <Container>
  //     <Wrapper>
  //       <HeroContainer>
  //         <HeroTitle>Oh oh...</HeroTitle>
  //         <HeroSubTitle>Something went wrong, please try again later!</HeroSubTitle>
  //         <SearchContainerMobile size={width}>
  //           <SearchBar focus={true}/>
  //         </SearchContainerMobile>
  //       </HeroContainer>
  //     </Wrapper>
  //   </Container>
  // )
}
