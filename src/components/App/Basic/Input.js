import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import ReactImageFallback from 'react-image-fallback'
import { formatUnits } from '@ethersproject/units'

import { Wallet as WalletIcon } from '../../Icons'
import { useTokenBalance } from '../../../hooks/useTokenBalance'
import { useWindowSize } from '../../../hooks/useWindowSize'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: top;
  width: 100%;
`

const InfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0px 10px 4px 10px;
`

const BarWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  background: #11202D;
  border: 1px solid rgba(146, 119, 224, 0.5);
  border-radius: 10px;

  & > * {
    &:last-child {
      margin-left: auto
    }
  }
`

const Label = styled.div`
  height: 16px;
  left: 503px;
  font-size: ${props => props.small ? '11px' : '13px'};
  line-height: ${props => props.small ? '11px' : '13px'};
  display: flex;
  align-items: center;
  color: #FFFFFF;
`

const Balance = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  & > * {
    &:first-child {
      margin-right: 4px;
    }
  }

  &:hover {
    cursor: pointer;
  }
`

const IconWrapper = styled(ReactImageFallback)`
  display:block;
  width: ${props => props.small ? '20px' : '30px'};
  height: auto;
  margin: 13px 9px 13px 14px;
`

const Symbol = styled.div`
  display: inline-block;
  width: auto;
  height: 30px;
  font-size: ${props => props.small ? '18px' : '24px'};
  line-height: 30px;
  align-items: center;
  text-align: left;
  color: #AFAFAF;
  white-space: nowrap;
`

const VertLine = styled.div`
  border-left: 1px solid #484848;
  height: 33px;
  margin: 12px;
`

const MaxButton = styled.div`
  width: 32px;
  height: 18px;
  font-size: ${props => props.small ? '11px' : '14px'};
  line-height: 18px;
  display: flex;
  align-items: center;
  text-align: right;
  color: #C4C4C4;

  &:hover {
    cursor: pointer;
  }
`

const AmountField = styled.input`
  display: inline-flex;
  justify-content: flex-end;
  text-align: right;
  align-text: right;
  line-height: 16px;
  margin: 0px 20px;
  background: transparent;
  border: none;
  font-size: ${props => props.small ? '11px' : '13px'};
  color: #CDCDCD;
  width: 100%;

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

export const InputBar = ({
  ticker,
  symbol,
  contract,
  decimals,
  isToken,
  amount,
  label,
  setAmount,
}) => {
  const balance = useTokenBalance(contract, isToken)
  const { width } = useWindowSize()
  const [formattedBalance, setFormattedBalance] = useState('0.00')
  const [displayBalance, setDisplayBalance] = useState('0.00')
  const [ small, setSmall ] = useState(width < 500)

  useEffect(() => {
    const result = (balance && balance.gt(0)) ? formatUnits(balance, decimals) : '0.00'
    setFormattedBalance && setFormattedBalance(result)

    const displayValue = (result === '0.00') ? '0.00' : parseFloat(result).toFixed(9).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1')
    setDisplayBalance && setDisplayBalance(displayValue)
  }, [balance])

  useEffect(() => {
    setSmall(width < 500)
  }, [width])

  return (
    <Wrapper>
      <InfoWrapper>
        <Label small={small}>{label}</Label>
        <Balance onClick={() => setAmount(formattedBalance)}>
          <WalletIcon/>
          <Label small={small}>{displayBalance}</Label>
        </Balance>
      </InfoWrapper>
      <BarWrapper>
        <IconWrapper
          src={`/images/tickers/${ticker.toUpperCase()}.png`}
          fallbackImage={'/images/fallback/ticker.png'}
          alt={`${ticker} Symbol Logo`}
          small={small}
        />
        <Symbol small={small}>{symbol}</Symbol>
        <VertLine/>
        {width >= 500 && (
          <MaxButton
            onClick={() => setAmount(formattedBalance)}
            small={small}
          >MAX</MaxButton>
        )}
        <AmountField
          onChange={(evt) => {
            const process = ( str ) => {
                return str.replace( /^([^.]*\.)(.*)$/, function ( a, b, c ) {
                    return b + c.replace( /\./g, '' );
                });
            }
            const value = evt.target.value.replace(/,/g, '.')

            // remove additional commas
            let output = process(value)
            setAmount(output)
          }}
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          type="text"
          pattern="^[0-9]*[.,]?[0-9]*$"
          value={amount}
          placeholder={amount || 'Enter an amount'}
          minLength={1}
          maxLength={18}
          spellCheck="false"
        />
      </BarWrapper>
    </Wrapper>
  )
}
