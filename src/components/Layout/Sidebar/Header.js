import React from 'react';
import styled from "styled-components";

import Logo from "../../../assets/logo.png"

const Wrapper = styled.div`
  text-align: center;

  & > img {
    max-height: 150px;
  }
`

export const Header = () => {
  return (
    <Wrapper>
      <img src={Logo} alt="dsynths logo"/>
    </Wrapper>
  )
}
