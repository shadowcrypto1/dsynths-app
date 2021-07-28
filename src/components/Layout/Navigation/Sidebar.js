import React, { useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'

import { DSynthsLogo, DSynthsText, NavToggle } from '../../Icons'

const Wrapper = styled.nav`
  position: absolute;
  background-color: black;
  top: 0;
  right: 0;
  bottom: 0;
  transition: ease all 2s;
  display: none;

  ${props => props.toggled && css`
    display: block;
    width: clamp(200px, 40vw, 300px);
  `};
`

export const Sidebar = ({ toggled, handleToggled }) => {
  const wrapperRef = useRef(null)
  useOutsideClick(wrapperRef, handleToggled)

  return (
    <Wrapper ref={wrapperRef} toggled={toggled}>
    </Wrapper>
  )
}

function useOutsideClick(ref, handleToggled) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handleToggled(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
}
