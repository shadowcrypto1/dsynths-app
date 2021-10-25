import React from 'react'
import styled from 'styled-components'

import { Search as SearchIcon } from '../../Icons'

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: clamp(210px, 300px, 100%);
  background: #DEDFEC;
  border: 1px solid #CECECE;
  border-radius: 5px;
  height: 22px;
  overflow: hidden;
  white-space: nowrap;
`

const Input = styled.input`
  display: block;
  padding-left: 10px;
  width: 100%;
  line-height: 14px;
  font-size: 14px;
  color: #000000;
  background: transparent;
  border: none;
  outline: none;
  text-align: left;
  text-overflow: ellipsis;
  cursor: pointer;
  -webkit-appearance: none;
`

export const SearchBar = ({ searchProps, value }) => {
  return (
    <InputWrapper>
      <Input
        {...searchProps}
        value={value}
        placeholder={'Search stocks, commodities & crypto'}
        autoFocus={true}
        onBlur={() => {}}
      />
      <SearchIcon style={{ alignSelf: 'center', marginRight: '5px'}} color={'#000000'}/>
    </InputWrapper>
  )
}
