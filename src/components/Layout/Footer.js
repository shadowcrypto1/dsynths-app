import React from 'react'
import styled from 'styled-components'

import { Twitter, Telegram, Github } from '../Icons'

const Wrapper = styled.div`
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;
  background: #5630DE;
  justify-content: space-between;
  font-size: 11.5px;
  line-height: 13px;
  align-items: center;
  color: #FFFFFF;
  padding: 0 15px;
`

const SocialsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  & > * {
    &:not(first-child){
      margin-left: 10px;
    }
  }
  @media only screen and (max-width: 767px) {
    display: none;
  }
`

const ReturnButton = styled.a`
  display: flex;
  height: 30px;
  padding: 0px 15px;
  line-height: 30px;
  background: #12092C;
  border-radius: 6px;
  text-align: center;
  text-decoration: none;
  align-text: center;
  color: white;
  font-size: 13px;

  @media only screen and (max-width: 767px) {
    display: none;
  }
`

export const Footer = () => {
  return (
    <Wrapper>
      <ReturnButton href='https://www.dsynths.com' target='_blank' rel='noreferrer noopener'>Return to Website</ReturnButton>
      <div style={{textAlign: 'center', flex: 1}}>This project is currently in beta, use at your own risk.</div>
      <SocialsWrapper>
        <a href={'https://twitter.com/dsynths'} target={'_blank'} rel="noreferrer noopener">
          <Twitter size={18}/>
        </a>
        <a href={'https://t.me/dsynths'} target={'_blank'} rel="noreferrer noopener">
          <Telegram size={18}/>
        </a>
        <a href={'https://github.com/dsynths'} target={'_blank'} rel="noreferrer noopener">
          <Github size={20}/>
        </a>
      </SocialsWrapper>
    </Wrapper>
  )
}
