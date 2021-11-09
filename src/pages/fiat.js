import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 30px;
`

export default function Markets() {
  return (
    <Container>
      <div>Fiat On-ramp will be made available soon</div>
    </Container>
  )
}
