import React, { useEffect } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: inline-block;
  width: auto;
  position: relative;
  transform: translateX(-12px);
  align-text: center;
  text-align: center;
  font-size: 7px;
  line-height: 11px;
  height: 11px;
  padding: 0px 3px;
  ${({type}) => type === 'info' && `
    background: #018746;
    box-shadow: 1px 1px 5px #037E43;
    border-radius: 4px;
    color: #00D16C;
  `};
`

export const Notify = ({ type, children }) => {
  return (
    <Wrapper type={type}>
      {children}
    </Wrapper>
  )
}
