import React from 'react'
import { X  } from 'react-feather'
import styled from 'styled-components'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 20px;
  align-items: center;
  margin-bottom: 13px;
  font-size: 12.5px;
  line-height: 16px;
`

const Close = styled(X)`
  width: 13px;
  height: 13px;
  color: #FFFFFF;
  &:hover {
    cursor: pointer;
  }
`

const Message = styled.div`
  display: block;
  height: 30x;
  font-size: 15px;
  line-height: 15px;
  color: ${props => props.success ? 'rgb(0, 209, 108)' : 'rgb(255, 33, 33)'};
`

export default function MessagePopup({ content, removeThisPopup }) {
  const { success, summary: { message } } = content

  return (
    <>
      <Header>
        <div></div>
        <Close onClick={removeThisPopup} />
      </Header>
      <Message success={success}>{message}</Message>
    </>
  )
}
