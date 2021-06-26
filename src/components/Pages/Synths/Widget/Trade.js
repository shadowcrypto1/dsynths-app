import React, { Fragment, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'

import { Card } from '../../../Card'
import { Title } from '../../../Title'
import { ReturnArrow } from '../../../Icons/ReturnArrow'
import { SwapArrow } from '../../../Icons/SwapArrow'
import { LongButton, ShortButton } from '../../../Button'
import { InputBoxSimple, Slider } from '../../../Trade'
import { TradeConnectButton } from '../../../../web3/components/TradeConnectButton'

import { ContractMapping } from '../../../../config'
import { useTokenBalance } from '../../../../web3/hooks/useTokenBalance'
import { formatBalance } from '../../../../utils/numbers'
import { getSymbolVariants } from '../../../../utils/registrars'
import { getRegistrars } from '../../../../web3/apollo/controllers'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  height: 100%;
  justify-content: flex-end;
  padding: 0px 10px;
`

const DirectionWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  padding-bottom: 10px;
`

const TypeItem = styled(LongButton)`
  background: ${props => props.active ? 'inherit' : 'var(--c-bg3)'};
  border-bottom: none;
  font-size: 15px;
  color: ${props => props.type === 'long' ? 'green' : '#c7271c'};
  font-weight: bold;
`

const TradeWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`

const ArrowWrapper = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  margin: 10px 0px;
`

const ArrowCircle = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: var(--c-bg2);
  border: 1px solid var(--c-bg3);
  &:hover {
    cursor: pointer;
  }
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 50px;
  margin-bottom: 10px;
`

const BackButton = styled.span`
  display: inline-block;
  justify-content: space-between;
  font-size: 14px;
  &:hover {
    cursor: pointer;
  }
`

const WalletBalance = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 12px;

  &:hover {
    cursor: pointer;
  }
`

const getTradeProps = async (ticker) => {
  try {
    const symbolMapping = getSymbolVariants(ticker, 'stock')
    const data = await getRegistrars(symbolMapping)

    let result = {}
    for (let i = 0; i < data.length; i++) {
      const type = (data[i].symbol.split('-').length > 1)
        ? data[i].symbol.slice(-1) === 'L' ? 'long' : 'short'
        : 'long'
      result[type] = {}
      result[type]['contract'] = data[i].id
      result[type]['symbol'] = data[i].symbol
      result[type]['name'] = data[i].name
    }
    return result
  } catch (err) {
    console.error(err)
    return []
  }
}

export const Trade = ({ toggle, ticker }) => {
  const { active, account } = useWeb3React()

  const daiBalance = 100 // useTokenBalance(ContractMapping["DAI"])
  const longBalance = 50
  const shortBalance = 800
  const [ estimatedPricePerDai, setEstimatedPricePerDai ] = useState(209)
  const [ availableFromBalance, setAvailableFromBalance ] = useState(daiBalance)

  const [ availableTypes, setAvailableTypes ] = useState([]) // ['long', 'short'] or just ['long']
  const [ tradeProps, setTradeProps ] = useState({})
  const [ currentType, setCurrentType ] = useState('long')
  const [ currentDirection, setCurrentDirection ] = useState('open')

  const [ fromSymbol, setFromSymbol ] = useState("DAI")
  const [ toSymbol, setToSymbol ] = useState(ticker)

  const [ fromAmount, setFromAmount ] = useState("")
  const [ toAmount, setToAmount ] = useState("")

  const [ showTradeButton, setShowTradeButton ] = useState((account && active) ? true : false)
  const [ showConnectButton, setShowConnectButton] = useState(!showTradeButton)

  useEffect(() => {
    initTradeProps()
  }, [ticker])

  useEffect(() => {
    calcToAmount()
  }, [currentDirection, currentType])

  useEffect(() => {
    if (account && active) {
      setShowTradeButton(true)
      setShowConnectButton(false)
    } else {
      setShowTradeButton(false)
      setShowConnectButton(true)
    }
  }, [account, active])

  useEffect(() => {
    calcToAmount() // add debounce here
  }, [fromAmount, estimatedPricePerDai])

  const initTradeProps = async () => {
    const obj = await getTradeProps(ticker)
    setTradeProps(obj)
    setToSymbol(obj['long'].symbol)
    setAvailableTypes(Object.keys(obj))
  }

  const handleTypeSwitch = (type) => {
    if (type === currentType) return

    let newAvailableFromBalance;
    let newFromSymbol;
    let newFromAmount;
    let newToSymbol;
    let newToAmount;

    if (fromSymbol == 'DAI') {
      newAvailableFromBalance = daiBalance
      newFromSymbol = 'DAI'
      newFromAmount = fromAmount
      newToSymbol = tradeProps[type].symbol
      newToAmount = ''
    } else {
      newAvailableFromBalance = (type === 'long' ? longBalance : shortBalance)
      newFromSymbol = tradeProps[type].symbol
      newFromAmount = ''
      newToSymbol = 'DAI'
      newToAmount = ''
    }

    setAvailableFromBalance(newAvailableFromBalance)
    setFromSymbol(newFromSymbol)
    setFromAmount(newFromAmount)
    setToSymbol(newToSymbol)
    setToAmount(newToAmount)

    setCurrentType(type)
  }

  const handleDirectionSwitch = async () => {
    let newAvailableFromBalance;
    let newFromSymbol;
    let newFromAmount;
    let newToSymbol;
    let newToAmount;

    if (fromSymbol == 'DAI') {
      newAvailableFromBalance = (currentType === 'long' ? longBalance : shortBalance)
      newFromSymbol = toSymbol
      newFromAmount = toAmount
      newToSymbol = 'DAI'
      newToAmount = ''
    } else {
      newAvailableFromBalance = daiBalance
      newFromSymbol = 'DAI'
      newFromAmount = toAmount
      newToSymbol = fromSymbol
      newToAmount = ''
    }

    setAvailableFromBalance(newAvailableFromBalance)
    setFromSymbol(newFromSymbol)
    setFromAmount(Math.min(newFromAmount, newAvailableFromBalance))
    setToSymbol(newToSymbol)
    setToAmount(newToAmount)

    setCurrentDirection(prevDirection => prevDirection === 'open' ? 'close' : 'open')
  }

  const calcToAmount = () => {
    if (!estimatedPricePerDai || !fromAmount || fromAmount === '') return setToAmount('')
    let result = (currentDirection === 'open')
      ? (fromAmount / estimatedPricePerDai).toFixed(6)
      : (fromAmount * estimatedPricePerDai).toFixed(6)
    setToAmount(result)
  }

  const sliderOnChange = (value) => {
    if (!value || value === 0) return setFromAmount('')
    setFromAmount((availableFromBalance * value / 100).toFixed(0))
  }

  const handleInputChange = (evt) => {
    const amount = evt.currentTarget.value
    if (!amount || amount === '') {
      setFromAmount('')
      setToAmount('')
      return
    }
    setFromAmount(amount)
    calcToAmount()
  }

  return (
    <Wrapper>
      <DirectionWrapper>
        {availableTypes && availableTypes.map((type, index) => (
          <TypeItem
            key={index}
            active={currentType === type}
            onClick={() => handleTypeSwitch(type)}
            type={type}
          >
            {type.toUpperCase()}
          </TypeItem>
        ))}
      </DirectionWrapper>
      {Object.keys(tradeProps) && (
        <TradeWrapper>
          <InputWrapper>
            <WalletBalance
              onClick={() => setFromAmount(availableFromBalance)}
            >
              Balance: {availableFromBalance} {fromSymbol}
            </WalletBalance>
            <InputBoxSimple
              label={'From'}
              value={fromAmount}
              symbol={fromSymbol}
              onChange={handleInputChange}
            />
            <ArrowWrapper>
              <ArrowCircle onClick={handleDirectionSwitch}>
                <SwapArrow/>
              </ArrowCircle>
            </ArrowWrapper>
            <InputBoxSimple label={"To"} value={toAmount} symbol={toSymbol}/>
          </InputWrapper>
          <Slider onChange={sliderOnChange} />
          {showTradeButton && <LongButton>{currentDirection.toUpperCase()} {currentType.toUpperCase()}</LongButton>}
          {showConnectButton && <TradeConnectButton>Connect Wallet</TradeConnectButton>}
        </TradeWrapper>
      )}
      <Footer>
        <BackButton onClick={toggle}>
          <ReturnArrow style={{verticalAlign: "middle", marginRight: "5px"}}/>
          Show {ticker} Stats
        </BackButton>
      </Footer>
    </Wrapper>
  )
}
