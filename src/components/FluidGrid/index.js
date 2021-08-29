import React, { useMemo } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`

const Side = styled.div`
  display: block;
  width: ${({width}) => width && `
    calc(50% - (${width} /2));
  `};

  @media screen and (max-width: 1024px) {
    display: none;
  };
`

const Left = styled(Side)`
  float: left;
`

const Right = styled(Side)`
  float: right;
`

const Center = styled.div`
  ${({width}) => width && `
    width: clamp(1px, ${width}, 100%);
  `};
  float:left;
`

export const FluidGrid = ({
  leftChild,
  centerChild,
  rightChild,
  centerWidth,
}) => {
  return (
    <Wrapper>
      <Left width={centerWidth}>{leftChild}</Left>
      <Center width={centerWidth}>{centerChild}</Center>
      <Right width={centerWidth}>{rightChild}</Right>
    </Wrapper>
  )
}
