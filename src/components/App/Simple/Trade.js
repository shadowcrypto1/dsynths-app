import React, { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from '@ethersproject/bignumber'
import Web3 from 'web3'

import { TradeButton } from './Button'
import { InputBar } from './Input'
import {
  DownArrow as DownArrowIcon,
  Loader as LoaderIcon,
} from '../../Icons'

import { setOpenModal } from '../../../state/application/actions'
import { flipAction } from '../../../state/action/actions'
import { useActionState } from '../../../state/action/hooks'
import { useMarketState } from '../../../state/market/hooks'

import { useTokenBalance } from '../../../hooks/useTokenBalance'
import { useRpcChangerCallback } from '../../../hooks/useRpcChangerCallback'
import { useAmountManager } from '../../../hooks/useAmountManager'
import { useDataFields } from '../../../hooks/useDataFields'
import { useCorrectNetworkURL } from '../../../hooks/useCorrectNetworkURL'
import { useWindowSize } from '../../../hooks/useWindowSize'

import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import { SyncState, useSyncCallback } from '../../../hooks/useSyncCallback'

const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-top: 30px;
  overflow: hidden;
`

const ArrowWrapper = styled.div`
  display: flex;
  position: absolute;
  left: 50%;
  top: 65px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #542FE6;
  transform: translateX(-50%);
  align-items: center;
  justify-content: center;
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
  font-size: ${props => props.isMobile ? '9px' : '11px'};
  line-height: ${props => props.isMobile ? '9px' : '11px'};

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
  const { account, active } = useWeb3React()
  const correctNetworkURL = useCorrectNetworkURL()
  const rpcChangerCallback = useRpcChangerCallback()
  const { width } = useWindowSize()
  const action = useActionState()
  const { networkName } = useMarketState()

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
      default:
        return `${formattedPrice} ${inputSymbol}/${outputSymbol}`
    }
  }, [price])

  const [approvalState, approveCallback] = useApproveCallback({
    address: inputContract,
    isToken: inputIsToken,
    symbol: inputSymbol,
    type: type,
  })

  const balance = useTokenBalance(inputContract, inputIsToken)
  const sufficientBalance = useMemo(() => {
    if (!inputAmount) return true
    if (!balance || balance.lte(0)) return false
    return (balance.gte(BigNumber.from(toWei(inputAmount, inputDecimals)))) ? true : false
  }, [balance, inputAmount])

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
    inputContract,
    inputDecimals,
    outputSymbol,
    outputContract,
    outputDecimals,
    outputAmount,
    balance,
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
        showBalance={true}
        setAmount={setInputAmount}
      />
      <ArrowWrapper onClick={() => dispatch(flipAction())}>
        <DownArrowIcon width={'8px'}/>
      </ArrowWrapper>
      <InputBar
        ticker={outputTicker}
        symbol={outputSymbol}
        contract={outputContract}
        decimals={outputDecimals}
        isToken={outputIsToken}
        amount={outputAmount}
        setAmount={setOutputAmount}
      />
      <NoteWrapper isMobile={width < 985}>
        <div>Fee: {fee * 100}%</div>
        <div>
          <a href='https://muon.net/' target='_blank' rel='noopener noreferrer'>Oracle </a>
          Price {priceFormatted()}
        </div>
      </NoteWrapper>
      {isClosed ? (
        <TradeButton
          disabled={true}
          size={(width < 500) ? '20px' : '24px'}
        >
          MARKET IS CLOSED
        </TradeButton>
      ) : (!active || !account) ? (
        <TradeButton
          onClick={() => dispatch(setOpenModal(true))}
          size={(width < 500) ? '20px' : '24px'}
        >
          CONNECT WALLET
        </TradeButton>
      ) : !correctNetworkURL ? (
        <TradeButton
          onClick={() => window.ethereum && rpcChangerCallback()}
          size={(width < 500) ? '16px' : '24px'}
        >
          {window.ethereum ? 'CLICK TO CHANGE NETWORK' : `PLEASE SWITCH TO ${networkName} FROM WITHIN YOUR WALLET`}
        </TradeButton>
      ) : approvalState === ApprovalState.NOT_APPROVED ? (
        <TradeButton
          onClick={handleApprove}
          size={(width < 500) ? '20px' : '24px'}
        >
          APPROVE
        </TradeButton>
      ) : approvalState === ApprovalState.PENDING ? (
        <TradeButton size={(width < 500) ? '20px' : '24px'}>
          <LoaderIcon size={'20px'} style={{marginRight: '5px'}}/>
          <span>APPROVING</span>
        </TradeButton>
      ) : syncState === SyncState.PENDING ? (
        <TradeButton size={(width < 500) ? '20px' : '24px'}>
          <LoaderIcon size={'20px'} style={{marginRight: '5px'}}/>
          <span>{type.toUpperCase()} TRANSACTING</span>
        </TradeButton>
      ) : !sufficientBalance ? (
        <TradeButton size={(width < 500) ? '20px' : '24px'}>
          INSUFFICIENT BALANCE
        </TradeButton>
      ) : (
        <TradeButton onClick={handleSync} size={(width < 500) ? '20px' : '24px'}>
          {action === 'OPEN' ? type.toUpperCase() : `CLOSE ${type.toUpperCase()}`}
        </TradeButton>
      )}
    </Wrapper>
  )
}

function toWei(number, decimals = 18) {
  let value = String(number)
  // Deal with super low amounts by removing any number >= decimals
  const indexDot = value.indexOf('.')
  if (indexDot !== -1 || value.substring(indexDot + 1).length > decimals) {
    value = value.substring(0, indexDot) + value.substring(indexDot, indexDot + decimals + 1)
  }

  let result = Web3.utils.toWei(String(value), 'ether')
  result = result.substr(0, result.length - (18 - decimals))
  return result.toString()
}
