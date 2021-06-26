import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  background-color: var(--c-bg2);
  border: 1px solid var(--c-bg3);
  border-radius: 5px;
  height: 50px;
  line-height: 50px;
  margin: 5px 0px;
`

const Label = styled.div`
  display: flex;
  align-text: center;
  margin-left: 10px;
`

const TransparentInput = styled.input`
  background: transparent;
  border: none;
  text-align: right;
  padding-right: 20px;

  &:focus {
    outline: none;
  }
`

const Symbol = styled.div`
  display: flex;
  justify-content: center;
`

export default function InputBoxSimple ({ label, value, symbol, onChange }) {
  const validate = (e) => {
    var ev = e || window.event;
    var key = ev.keyCode || ev.which;
    key = String.fromCharCode(key);
    var regex = /[0-9\\.]/;
    if (!regex.test(key)) {
      ev.returnValue = false;
      if (ev.preventDefault) ev.preventDefault();
    }
  }
  return (
    <Wrapper>
      <Label>{label}</Label>
      <TransparentInput
        label={label}
        value={value}
        symbol={symbol}
        onChange={onChange}
        onKeyPress={validate}
        type={'number'}
        autoComplete={'off'}
        autoCorrect={'off'}
        placeholder={'0.0'}
        spellcheck={false}
        step={'any'}
      />
      <Symbol>{symbol}</Symbol>
    </Wrapper>
  )
}
