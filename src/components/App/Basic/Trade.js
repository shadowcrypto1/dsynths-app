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
    if (!balance || balance.lte(0) || !inputAmount) return true // edge case where we ignore 0 balances (those are filtered by the syncCallback)
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
        label={'To (estimated)'}
        setAmount={setOutputAmount}
      />
      <NoteWrapper isMobile={width < 985}>
        <div>{fee * 100}% Fee</div>
        <div>
          <a href='https://muon.net/' target='_blank' rel='noopener noreferrer'>Oracle </a>
          Price {priceFormatted()}
        </div>
      </NoteWrapper>
      {(!active || !account) ? (
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
          {window.ethereum ? 'CHANGE WALLET NETWORK' : `PLEASE SWITCH TO ${networkName} FROM WITHIN YOUR WALLET`}
        </TradeButton>
      ) : isClosed ? (
        <TradeButton
          disabled={true}
          size={(width < 500) ? '20px' : '24px'}
        >
          MARKET IS CLOSED
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
