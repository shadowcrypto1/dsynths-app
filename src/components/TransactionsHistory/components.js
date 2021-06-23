import React from 'react'
import styled from 'styled-components'

import { Card } from "../Card";
import { Row } from "../Row";
import { Loader } from "../Loader";

export const AutoColumn = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
  justify-items: ${({ justify }) => justify && justify};
`

export const HeaderItem = styled.div`
  display: flex;
  font-weight: 500;
  border: none;
  font-size: 1rem;
  color: var(--font-text3);
  justify-content: center;
  outline: none;
  @media screen and (max-width: 600px) {
    font-size: 14px;
  }
`

export const TableText = styled.div`
  display: flex;
  font-size: 0.8rem;
  justify-content: center;
  align-items: center;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media screen and (max-width: 640px) {
    font-size: 12px;
  }
`

export const FullRow = styled.div`
  display: flex;
  justify-content: center;
`

export const Wrapper = styled.div`
  display: flex;
  min-height: 200px;
  justify-content: center;
  align-items: center;
`

export const WrappedLoader = () => {
  return (
    <Wrapper>
      <Loader size="40px"/>
    </Wrapper>
  )
}
