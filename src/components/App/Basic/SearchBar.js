import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import SelectSearch, { useSelect } from 'react-select-search'
import Fuse from 'fuse.js'
import qs from 'query-string'

import { useBaseState } from '../../../state/base/hooks'
import { useConductedState } from '../../../state/conducted/hooks'
import { useDetailsState } from '../../../state/details/hooks'
import { Search as SearchIcon } from '../../Icons'

const Wrapper = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 10px;
`

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  background-color: rgba(91, 96, 204, 0.15);
  border: 1px solid rgba(146, 119, 224, 0.5);
  border-radius: 6px;
`

const Input = styled.input`
  display: block;
  padding-left: 10px;
  width: 100%;
  font-size: 12.5px;
  line-height: 20px;
  color: #FFFFFF;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  text-align: left;
  text-overflow: ellipsis;
  cursor: pointer;

  -webkit-appearance: none;
`

const OptionsWrapper = styled.div`
  overflow: auto;
  max-height: 360px;
  background: transparent;

  border: 1px solid rgba(91, 96, 204, 0.5);
  list-style: none;
  border-radius: 6px;

  & > * {
    &:not(:first-child) {
      border-top: 1px solid rgba(91, 96, 204, 0.3);
    }
  }
`

const OptionRow = styled.button`
  display: grid;
  grid-template-columns: 1fr 4fr;
  height: 30px;
  width: 100%;
  border: none;
  outline: none;
  background-color: ${props => props.selected ? 'rgba(91, 96, 204, 0.35)' : 'rgba(91, 96, 204, 0.15)'};

  font-size: 14px;
  color: white;
  padding-left: 10px;
  line-height: 30px;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
  };

  & > * {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
`

const NoResult = styled(OptionRow)`
  display: block;
  text-align: center;
  align-text: center;
`

export const SearchBar = ({ isDesktop }) => {
  const { location, push, replace } = useHistory()
  const conducted = useConductedState()
  const details = useDetailsState()
  const base = useBaseState()

  const options = useMemo(() => {
    if (!details) return
    return conducted.data.map(synth => {
      const obj = details.data[synth.id]
      return {
        name: obj.name,
        value: obj.symbol,
      }
    })
  }, [conducted, details])

  const [snapshot, valueProps, optionProps] = useSelect({
    options,
    value: base.symbol,
    search: true,
    filterOptions: fuzzySearch,
    allowEmpty: true
  })

  useEffect(() => {
    const symbol = snapshot.value

    if (!symbol) return // initial render is null, if not filtered it will cause performance issues
    if (base.symbol.toUpperCase() === symbol?.toUpperCase()) return

    const queryParams = qs.parse(location.search)
    const query = { ...queryParams, symbol: symbol }

    // Dispatch changes by altering the url, this won't cause a re-render/reload, but will be picked up by URLParsing listeners
    push({ search: qs.stringify(query)})

  }, [snapshot.value])

  return (
    <Wrapper isDesktop={isDesktop}>
      <InputWrapper>
        <Input
          {...valueProps}
          value={snapshot.search}
          placeholder={'Search stocks'}
        />
        <SearchIcon style={{ alignSelf: 'center', marginRight: '5px'}}/>
      </InputWrapper>
      {(snapshot.focus || isDesktop) && (
        <OptionsWrapper>
          {snapshot.options.map(option => (
            <OptionRow
              key={option.value}
              {...optionProps}
              value={option.value}
              selected={option.value.toUpperCase() === base?.symbol.toUpperCase()}
              isDesktop={isDesktop}
            >
              <div>{option.value}</div>
              <div>{option.name}</div>
            </OptionRow>
          ))}
          {!snapshot.options.length && (
            <NoResult isDesktop={isDesktop}>No Results Found</NoResult>
          )}
        </OptionsWrapper>
      )}
    </Wrapper>
  )
}

function fuzzySearch(options) {
  const fuse = new Fuse(options, {
    keys: [ 'name', 'value' ],
    threshold: 0.3,
  });

  return (value) => {
    if (!value.length) {
      return options;
    }

    return fuse.search(value);
  }
}
