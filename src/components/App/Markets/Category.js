import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: block;
  align-text: center;
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 13px;
  background: linear-gradient(109.2deg, #532EE6 2.09%, #6A3EA6 99.42%);
  border-radius: 6px 6px 0px 0px;
`

export const Category = ({ name }) => {
  return (
    <Wrapper>
      {name}
    </Wrapper>
  )
}
