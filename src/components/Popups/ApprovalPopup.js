import React from 'react'
import { X, CheckCircle, AlertCircle, ArrowUpRight } from 'react-feather'
import styled from 'styled-components'

import { getExplorerLink } from '../../utils/getExplorerLink'

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 20px;
  align-items: center;
  margin-bottom: 13px;
  font-size: 12.5px;
  line-height: 16px;
  color: ${props => props.success ? '#00D16C' : '#FF2121'};
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

export default function ApprovalPopup({ content, removeThisPopup }) {
  const {
    hash,
    success,
    summary: {
      chainId,
      params: {
        symbol,
      },
    }
  } = content

  return (
    <>
      <Header success={success}>
        <div>Approval</div>
        <Close onClick={removeThisPopup} />
      </Header>
      <Summary>{`Approve ${symbol}`}</Summary>
      <Box>
        {success ? <CheckCircle color='#00E376' size={15}/> : <AlertCircle color='red' size={15}/>}
        <div style={{ paddingLeft: '10px' }}>{success ? 'Approval successful' : 'Approval has failed'}</div>
        <ExternalLink href={getExplorerLink(chainId, hash)} target='_blank' rel='noopener noreferrer'>
          <ArrowUpRight size={14} color={'#FFFFFF'}/>
        </ExternalLink>
      </Box>
    </>
  )
}
