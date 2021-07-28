import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import ReactImageFallback from 'react-image-fallback'
import { useWeb3React } from '@web3-react/core'
import { formatUnits } from '@ethersproject/units'
import { lighten, darken } from 'polished'

import { TradeButton } from './Button'
import {
  DownArrow as DownArrowIcon,
  Wallet as WalletIcon
} from '../../Icons'

import { getMarketMaker, approve, buy } from './helpers'
import { usePrices } from '../../../hooks/usePrices'
import { useERC20, useAMM } from '../../../web3/hooks/useContract'
import { useTokenBalance } from '../../../web3/hooks/useTokenBalance'
import { useTokenAllowance } from '../../../web3/hooks/useTokenAllowance'
import { supportedChainIds } from '../../../web3/connectors'

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(91, 96, 204, 0.15);
  border: 1px solid rgba(146, 119, 224, 0.5);
  border-radius: 10px;
  height: 100%;
  padding: 30px 29px 36px 29px;
  overflow: hidden;
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: top;
  width: 100%;
`

const InputHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0px 10px 4px 10px;
`

const HeaderLabel = styled.div`
  height: 16px;
  left: 503px;
  font-size: 13px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #FFFFFF;
`

const WalletBalance = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & > * {
    &:first-child {
      margin-right: 4px;
    }
  }

  &:hover {
    cursor: pointer;
  }
`

const InputBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  background: #11202D;
  border: 1px solid rgba(146, 119, 224, 0.5);
  border-radius: 10px;

  ${({ disabled }) => disabled && `
    opacity: 1; TODO: think about this
  `};

  & > * {
    &:last-child {
      margin-left: auto
    }
  }
`

const IconWrapper = styled(ReactImageFallback)`
  display:block;
  width: 30px;
  height: auto;
  margin: 13px 9px 13px 14px;
`

const Ticker = styled.div`
  width: fit-content;
  height: 30px;
  font-size: 24px;
  line-height: 30px;
  display: flex;
  align-items: center;
  text-align: right;
  margin: 13px 13px 13px 0px;
  color: #AFAFAF;
`

const Line = styled.div`
  border-left: 1px solid #484848;
  height: 33px;
  margin: 11px 12px 12px 0px;
`

const MaxButton = styled.div`
  width: 32px;
  height: 18px;
  font-size: 14px;
  line-height: 18px;
  display: flex;
  align-items: center;
  text-align: right;
  color: #C4C4C4;
  margin: 19px 0;

  &:hover {
    cursor: pointer;
  }
`

const AmountField = styled.input`
  display: inline-  flex;
  justify-content: flex-end;
  text-align: right;
  align-text: right;
  max-width: 120px;
  line-height: 16px;
  padding-right: 20px;
  background: transparent;
  border: none;
  font-size: 13px;
  color: #CDCDCD;

  &:focus {
    outline: none;
  }

  &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #CDCDCD;
    opacity: 1; /* Firefox */
  }

  &:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #CDCDCD;
  }

  &::-ms-input-placeholder { /* Microsoft Edge */
    color: #CDCDCD;
  }
`

const StyledArrow = styled(DownArrowIcon)`
  display: block;
  width: 100%;
  margin-top: 18px;
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

export const Form = ({
  networkName,
  wrongNetwork,
  symbol,
  isLong,
  inputTicker,
  inputContract,
  outputTicker,
  outputContract,
}) => {
  const { account, chainId } = useWeb3React()
  const { oraclePrice, oracleSuccess } = usePrices(networkName, symbol)
  const walletBalanceInput = useTokenBalance(inputContract)
  const marketMaker = getMarketMaker(networkName)
  const TokenContract = useERC20(inputContract)
  const AMMContract = useAMM(marketMaker)
  const inputAllowance = useTokenAllowance(inputContract, marketMaker)

  const [ didMount, setDidMount ] = useState(false)
  const [ payload, setPayload ] = useState({
    connectWallet: false,
    networkError: false,
    marketClosed: false,
    noBalance: false,
    oracleError: false,
    approve: false,
    trade: true,
  })

  const [ inputBalance, setInputBalance ] = useState('')
  const [ inputAmount, setInputAmount ] = useState('')
  const [ outputAmount, setOutputAmount ] = useState('')
  const [ tradeButtonText, setTradeButtonText ] = useState('')

  useEffect(() => setDidMount(true), [])

  useEffect(() => {
    switch (true) {
      case payload.connectWallet:
        setTradeButtonText('CONNECT WALLET')
        break
      case payload.networkError:
        // TODO: fix this, as it never triggers because unsupported networks are rejected by default @ connectors.js
        setTradeButtonText('WRONG NETWORK')
        break
      case payload.marketClosed:
        setTradeButtonText('MARKET IS CLOSED')
        break
      case payload.noBalance:
        setTradeButtonText('INSUFFICIENT BALANCE')
        break
      case payload.oracleError:
        setTradeButtonText('ORACLE ERROR')
        break
      case payload.approve:
        setTradeButtonText('APPROVE')
        break
      case payload.trade:
        setTradeButtonText(isLong ? 'LONG' : 'SHORT')
        break
      default:
        setTradeButtonText(isLong ? 'LONG' : 'SHORT')
    }
  }, [payload])

  useEffect(() => {
    const connectWallet = account ? false : true
    const networkError = supportedChainIds.includes(chainId) ? false : true
    setPayload(prevState => ({
      ...prevState,
      connectWallet: connectWallet,
      networkError: networkError
    }))
  }, [account, chainId, didMount])

  useEffect(() => {
    setPayload(prevState => ({
      ...prevState,
      oracleError: oracleSuccess,
    }))
  }, [oracleSuccess])

  useEffect(() => {
    const isApproved = parseInt(formatUnits(inputAllowance, 18)) > 0
    setPayload(prevState => ({
      ...prevState,
      approve: !isApproved,
      trade: isApproved
    }))
  }, [inputAllowance])

  useEffect(() => {
    let marketClosed = false
    if (oracleSuccess && oraclePrice) {
      const key = (isLong) ? 'Long' : 'Short'
      marketClosed = !!oraclePrice[key]?.is_close || oraclePrice[key].price === 0
    }

    setPayload(prevState => ({
      ...prevState,
      oracleError: !oracleSuccess,
      marketClosed: marketClosed,
    }))
  }, [oraclePrice, oracleSuccess, isLong])

  useEffect(() => {
    setInputBalance(walletBalanceInput ? formatUnits(walletBalanceInput, 18) : '0')
  }, [walletBalanceInput])

  useEffect(() => {
    let newOutputAmount = '0'
    const cleanUp = () => {
      setOutputAmount(newOutputAmount)
      setPayload(prevState => ({
        ...prevState,
        noBalance: (inputAmount == '')
          ? false
          : Number(inputAmount) > Number(inputBalance)
      }))
    }

    if (!inputAmount) {
      newOutputAmount = ''
      return cleanUp()
    }

    if (inputAmount === '0' || !oracleSuccess || !oraclePrice) return cleanUp()

    try {
      let result = (isLong)
        ? (inputAmount / oraclePrice.Long.price) * (1 - oraclePrice.Long.fee)
        : (inputAmount * oraclePrice.Short.price) * (1 - oraclePrice.Short.fee)
      if (!Number.isFinite(result) || result === 0) return cleanUp()
      newOutputAmount = result.toFixed(5).toString()
    } catch (err) {
      console.log(err) // catch oracleError
      newOutputAmount = '0'
    }
    cleanUp()
  }, [inputAmount, inputBalance, isLong, oraclePrice])

  const onFieldChange = (evt, location) => {
    const amount = evt.currentTarget.value
    if (!amount || amount == '') {
      setInputAmount('')
      setOutputAmount('')
      return
    }
    if (location === 'input') {
      setInputAmount(amount)
    } else {
      setOutputAmount(amount)
    }
  }

  const handlePayload = () => {
    const onSuccess = (res) => {
      console.log(res)
      // do something
    }

    const onError = (err) => {
      console.log(err)
      // do something
    }

    if (payload === 'approve') {
      approve(TokenContract, inputContract, account, marketMaker, onSuccess, onError)
    } else {
      // this is `buy` and not `trade`, since its a one-way trade (no selling on this form, user needs to use app.deus or /advanced to sell)
      if (Number(inputAmount) > 0 && Number(inputAmount) <= Number(inputBalance)) {
        buy(AMMContract, outputContract, outputAmount, account, onSuccess, onError)
      } else {
        console.log('inputamount is insufficient')
      }
    }
  }

  return (
    <FormWrapper>
      <InputWrapper>
        <InputHeader>
          <HeaderLabel>From</HeaderLabel>
          <WalletBalance onClick={() => setInputAmount(Number(inputBalance))}>
            <WalletIcon/>
            <HeaderLabel>{Number(inputBalance).toFixed(8)} {inputTicker}</HeaderLabel>
          </WalletBalance>
        </InputHeader>
        <InputBar>
          <IconWrapper
            src={`/img/tickers/${inputTicker}.png`}
            fallbackImage={'/img/fallback/ticker.png'}
            alt={`${inputTicker}_logo`}
          />
          <Ticker>{inputTicker}</Ticker>
          <Line/>
          <MaxButton onClick={() => setInputAmount(inputBalance)}>MAX</MaxButton>
          <AmountField
            onChange={(evt) => onFieldChange(evt, 'input')}
            type={'number'}
            placeholder={'Enter an amount'}
            value={inputAmount}
            autoComplete={'off'}
            autoCorrect={'off'}
            spellcheck={false}
            step={'any'}
          />
        </InputBar>
        <StyledArrow/>
        <InputHeader>
          <HeaderLabel>To</HeaderLabel>
        </InputHeader>
        <InputBar disabled={true}>
          <IconWrapper
            src={`/img/tickers/${symbol}.png`}
            fallbackImage={'/img/fallback/ticker.png'}
            alt={`${symbol}_logo`}
          />
          <Ticker>{outputTicker}</Ticker>
          <Line/>
          <AmountField
            disabled={true}
            placeholder={'You will receive'}
            value={outputAmount}
          />
        </InputBar>
      </InputWrapper>
      <NoteWrapper>
        <div>Click here to close an existing position</div>
        <div>
          <a href='https://muon.net/' target='_blank' rel='noopener noreferrer'>Oracle </a>
          price: {isLong
            ? `${oraclePrice?.Long?.price} ${inputTicker}/${outputTicker}`
            : `${oraclePrice?.Short?.price} ${inputTicker}/${outputTicker}`
          }
        </div>
      </NoteWrapper>
      <TradeButton
        onClick={handlePayload}
        disabled={false} // TODO: implement this
      >
        {tradeButtonText}
      </TradeButton>
    </FormWrapper>
  )
}
