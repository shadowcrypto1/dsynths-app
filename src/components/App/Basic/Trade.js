import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import ReactImageFallback from "react-image-fallback"
import { formatUnits } from "@ethersproject/units"
// import { useWeb3React } from '@web3-react/core'
import { RotateCw } from 'react-feather'
import { useActiveWeb3React } from '../../../hooks/useWeb3'

import { TradeButton } from './Button'
import { InputBar } from './Input'
import {
  DownArrow as DownArrowIcon,
  Loader as LoaderIcon,
} from '../../Icons'

import { setOpenModal } from '../../../state/application/actions'
import { useBaseState } from '../../../state/base/hooks'
import { usePairState } from '../../../state/pair/hooks'
import { useSynchronizerState } from '../../../state/synchronizer/hooks'
import { resetState, setSyncOpen, setSyncClose, setApprove } from '../../../state/synchronizer/actions'
import { flipAction } from '../../../state/action/actions'

import { useRpcChangerCallback } from '../../../hooks/useRpcChangerCallback'
import { useAmountManager } from '../../../hooks/useAmountManager'
import { useDataFields } from '../../../hooks/useDataFields'
import { useTokenAllowance } from '../../../hooks/useTokenAllowance'
import { useCorrectNetworkURL } from '../../../hooks/useCorrectNetworkURL'

import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import { SyncState, useSyncCallback } from '../../../hooks/useSyncCallback'
import { SYNCHRONIZER_ADDRESSES_BY_CHAIN_ID } from '../../../constants'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(91, 96, 204, 0.15);
  border: 1px solid rgba(146, 119, 224, 0.5);
  border-radius: 10px;
  width: 100%;
  height: 100%;
  padding: 30px 29px 36px 29px;
  overflow: hidden;
`

const StyledArrow = styled(DownArrowIcon)`
  margin-top: 18px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  &:hover {
    cursor: pointer;
  }
`

const NoteWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 10px 10px 30px 10px;
  color: rgba(255, 255, 255, 0.69);
  width: 100%;
  height: 11px;
  font-size: 9px;
  line-height: 11px;

  & > * {
    & > a {
      text-decoration-line: underline;
      text-decoration-style: dotted;
      color: rgba(255, 255, 255, 0.69);
    }
  }
`

export const Trade = ({ type }) => {
  const dispatch = useDispatch()
  const { account, active, chainId } = useActiveWeb3React()
  const correctNetworkURL = useCorrectNetworkURL()
  const rpcChangerCallback = useRpcChangerCallback()

  const {
    inputTicker,
    inputSymbol,
    inputContract,
    inputDecimals,
    inputIsToken,
    outputTicker,
    outputSymbol,
    outputContract,
    outputDecimals,
    outputIsToken,
    quote,
  } = useDataFields(type)

  const { price, fee, isClosed } = quote[type.toLowerCase()]

  const {
    inputAmount,
    outputAmount,
    setInputAmount,
    setOutputAmount,
  } = useAmountManager(price, type, fee)

  const priceFormatted = useCallback(() => {
    let formattedPrice = price ? price.toFixed(2) : 0
    switch (type) {
      case 'LONG':
        return `${formattedPrice} ${inputSymbol}/${outputSymbol}`
      case 'SHORT':
        return `${formattedPrice} ${outputSymbol}/${inputSymbol}`
    }
  }, [price])

  const [approvalState, approveCallback] = useApproveCallback({
    address: inputContract,
    isToken: inputIsToken,
    symbol: inputSymbol,
    type: type,
  })

  const handleApprove = useCallback(async () => {
    await approveCallback()

    // if (signatureState === UseERC20PermitState.NOT_SIGNED && gatherPermitSignature) {
    //   try {
    //     await gatherPermitSignature()
    //   } catch (error) {
    //     // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
    //     if (error?.code !== 4001) {
    //       await approveCallback()
    //     }
    //   }
    // } else {
    //   await approveCallback()
    // }
  }, [approveCallback]) // ,gatherPermitSignature, signatureState

  const [syncState, syncCallback] = useSyncCallback({
    inputSymbol,
    inputAmount,
    outputSymbol,
    outputContract,
    outputDecimals,
    outputAmount,
    type,
  })
  const handleSync = async () => {
    syncCallback()
  }

  return (
    <Wrapper>
      <InputBar
        ticker={inputTicker}
        symbol={inputSymbol}
        contract={inputContract}
        decimals={inputDecimals}
        isToken={inputIsToken}
        amount={inputAmount}
        label={'From'}
        setAmount={setInputAmount}
      />
      <StyledArrow onClick={() => {
        dispatch(flipAction())
      }}/>
      <InputBar
        ticker={outputTicker}
        symbol={outputSymbol}
        contract={outputContract}
        decimals={outputDecimals}
        isToken={outputIsToken}
        amount={outputAmount}
        label={'To'}
        setAmount={setOutputAmount}
      />
      <NoteWrapper>
        <div>{fee * 100}% Fee</div>
        <div>
          <a href='https://muon.net/' target='_blank' rel='noopener noreferrer'>Oracle </a>
          Price {priceFormatted()}
        </div>
      </NoteWrapper>
      {(!active || !account) ? (
        <TradeButton onClick={() => {
          dispatch(setOpenModal(true))
        }}>
          CONNECT WALLET
        </TradeButton>
      ) : !correctNetworkURL ? (
        <TradeButton onClick={() => rpcChangerCallback()}>
          SWITCH NETWORK
        </TradeButton>
      ) : isClosed ? (
        <TradeButton disabled={true}>
          MARKET IS CLOSED
        </TradeButton>
      ) : approvalState === ApprovalState.NOT_APPROVED ? (
        <TradeButton onClick={handleApprove}>
          APPROVE
        </TradeButton>
      ) : approvalState === ApprovalState.PENDING ? (
        <TradeButton>
          <LoaderIcon size={'20px'} style={{marginRight: '5px'}}/>
          <span>APPROVING</span>
        </TradeButton>
      ) : syncState === SyncState.PENDING ? (
        <TradeButton>
          <LoaderIcon size={'20px'} style={{marginRight: '5px'}}/>
          <span>{type.toUpperCase()} TRANSACTING</span>
        </TradeButton>
      ) : (
        <TradeButton onClick={handleSync}>
          {type.toUpperCase()}
        </TradeButton>
      )}
    </Wrapper>
  )
}
