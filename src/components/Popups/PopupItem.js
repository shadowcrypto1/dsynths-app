import React, { useCallback, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Loader, ArrowUpRight } from 'react-feather'
import { useSpring } from '@react-spring/web'
import { animated } from 'react-spring'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'

import { PopupContent } from '../../state/application/actions'
import { useRemovePopup } from '../../state/application/hooks'

import { getExplorerLink } from '../../utils/getExplorerLink'

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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 20px;
  align-items: center;
  margin-bottom: 13px;
  font-size: 12.5px;
  line-height: 16px;
  color: #00D16C;
`

const Close = styled(X)`
  width: 13px;
  height: 13px;
  color: #FFFFFF;
  &:hover {
    cursor: pointer;
  }
`

const Summary = styled.div`
  display: block;
  height: 50x;
  font-size: 15px;
  line-height: 15px;
  color: #FFFFFF;
  margin-bottom: 13px;
`

const Box = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  height: 30px;
  background: #181F3D;
  border: 0.5px solid #4F4582;
  border-radius: 10px;
  font-size: 12.5px;
  line-height: 16px;
  align-items: center;
  color: #FFFFFF;
  padding: 0px 10px;

  & > * {
    &:last-child {
      margin-left: auto;
    }
  }
`

const ExternalLink = styled.a`
  display: flex;
  align-items: center;
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
  const { chainId } = useWeb3React()
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

  const { txn: { hash, success, summary }} = content

  return (
    <Wrapper>
      <Header>
        <div>{summary.header}</div>
        <Close onClick={removeThisPopup} />
      </Header>
      <Summary>{summary.body}</Summary>
      <Box>
        {success ? <CheckCircle color='#00E376' size={15}/> : <AlertCircle color='red' size={15}/>}
        <div style={{ paddingLeft: '10px' }}>{success ? 'Transaction successful' : 'Transaction has failed'}</div>
        <ExternalLink href={getExplorerLink(chainId, hash)} target='_blank' rel='noopener noreferrer'>
          <ArrowUpRight size={14} color={'#FFFFFF'}/>
        </ExternalLink>
      </Box>
      {removeAfterMs !== null ? <AnimatedFader style={faderStyle} /> : null}
    </Wrapper>
  )
}
