import React, { useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import { ChevronDown } from '../Icons'

const DropdownContainer = styled.div`
  float: left;
  overflow: hidden;
  &:hover {
    display: block;
  }
`

const DropdownButton = styled.button`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 18px;
  padding: 4px 17px;
  align-items: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  background: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  font-family: inherit; /* Important for vertical align on mobile phones */
  margin: 0; /* Important for vertical align on mobile phones */

  &:hover {
    color: #f6cc2e;
  }

  &:focus {
    outline: none;
  }
`

const DropdownContent = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  position: absolute;
  width: 150px;
  z-index: 1;

  background: #28116a;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  overflow: hidden;

  & > a {
    float: none;
    color: white;
    padding: 15px;
    text-decoration: none;
    display: block;
    text-align: left;

    &:hover {
      color: #f6cc2e;
      background: #351690;
    }
  }
`

export const Dropdown = ({ name, linksMapping }) => {
  const [show, setShow] = useState(false)
  return (
    <DropdownContainer onMouseOver={() => setShow(true)} onMouseOut={() => setShow(false)}>
      <DropdownButton>
        <span>{name}</span>
        <ChevronDown width="15" style={{ marginLeft: '5px' }} />
      </DropdownButton>
      <DropdownContent show={show}>
        {linksMapping.length &&
          linksMapping.map((o, index) => (
            <Link href={o.href} key={index}>
              <a>{o.name}</a>
            </Link>
          ))}
      </DropdownContent>
    </DropdownContainer>
  )
}
