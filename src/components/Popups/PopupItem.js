import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { animated } from 'react-spring'
import { useSpring } from '@react-spring/web'

import { useRemovePopup } from '../../state/application/hooks'
import TransactionPopup from './TransactionPopup'
import ApprovalPopup from './ApprovalPopup'
import MessagePopup from './MessagePopup'

const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  width: 100%;
  height: auto;
  margin-top: 10px;
  background: #191E38;
  border: 0.5px solid rgba(146, 119, 224, 0.5);
  border-radius: 10px;
  padding: 15px;
  overflow: hidden;
`

const Fader = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 2px;
  background-color: rgba(255, 255, 255, 0.3);
`

const AnimatedFader = animated(Fader)

export default function PopupItem({ removeAfterMs, content, popKey }) {
  const removePopup = useRemovePopup()
  const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])

  useEffect(() => {
    if (removeAfterMs === null) return undefined

    const timeout = setTimeout(() => {
      removeThisPopup()
    }, removeAfterMs)

    return () => {
      clearTimeout(timeout)
    }
  }, [removeAfterMs, removeThisPopup])

  const faderStyle = useSpring({
    from: { width: '100%' },
    to: { width: '0%' },
    config: { duration: removeAfterMs ?? undefined },
  })

  const { summary: { eventName }} = content
  return (
    <Wrapper>
      {eventName === 'transaction' ? (
        <TransactionPopup content={content} removeThisPopup={removeThisPopup}/>
      ) : eventName === 'approval' ? (
        <ApprovalPopup content={content} removeThisPopup={removeThisPopup}/>
      ) : (
        <MessagePopup content={content} removeThisPopup={removeThisPopup}/>
      )}
      {removeAfterMs !== null ? <AnimatedFader style={faderStyle} /> : null}
    </Wrapper>
  )
}
