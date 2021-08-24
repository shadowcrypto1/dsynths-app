import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from 'react'
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

const CenteredBlock = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  height: 100%;
  justify-content: center;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: ${({isDesktop}) => isDesktop ? '35px 0 50px 0' : '5px 0 50px 0'};
`

const Column = styled.div`
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  justify-content: flex-start;
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

  if (status === 'LOADING') {
    return (
      <CenteredBlock style={{alignItems: 'center'}}>
        <LoaderIcon size={'90px'}/>
      </CenteredBlock>
    )
  }

  if (status === 'NOT_FOUND') {
    return (
      <GridContainer>
        <div/>
        <Column width={''}>
          <HeroTitle>Stock not found</HeroTitle>
          <HeroSubTitle>Try a different stock or switch networks!</HeroSubTitle>
          <SearchBar focus={true}/>
          <NetworkBar/>
        </Column>
        <div/>
      </GridContainer>
    )
  }
  //
  // if (status === 'OK') {
  //   return (
  //     <React.Fragment>
  //       {width >= 985 ? (
  //         <React.Fragment>
  //           <SearchContainerDesktop size={width}>
  //             <NetworkBar style={{marginBottom: '8px'}}/>
  //             <SearchBar focus={width >= 985}/>
  //           </SearchContainerDesktop>
  //           <Wrapper>
  //             <HeroContainer>
  //               <Hero symbol={base.symbol.toUpperCase()} name={base.name} isDesktop={true}/>
  //             </HeroContainer>
  //             <TradeContainer>
  //               <TypeWrapper>
  //                 <LongTab selected={type === 'LONG'} onClick={() => setType('LONG')}>LONG</LongTab>
  //                 <ShortTab selected={type === 'SHORT'} onClick={() => setType('SHORT')}>SHORT</ShortTab>
  //               </TypeWrapper>
  //               <Trade type={type} />
  //             </TradeContainer>
  //           </Wrapper>
  //         </React.Fragment>
  //       ) : (
  //         <Wrapper>
  //           <HeroContainer>
  //             <Hero symbol={base.symbol.toUpperCase()} name={base.name} isDesktop={false}/>
  //           </HeroContainer>
  //           <SearchContainerMobile size={width}>
  //             <SearchBar isDesktop={width >= 985}/>
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
  //     </React.Fragment>
  //   )
  // }
  //
  // return (
  //   <React.Fragment>
  //     <Wrapper>
  //       <HeroContainer>
  //         <HeroTitle>Oh oh...</HeroTitle>
  //         <HeroSubTitle>Something went wrong, please try again later!</HeroSubTitle>
  //         <SearchContainerMobile size={width}>
  //           <SearchBar focus={true}/>
  //         </SearchContainerMobile>
  //       </HeroContainer>
  //     </Wrapper>
  //   </React.Fragment>
  // )
}
