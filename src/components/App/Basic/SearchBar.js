import React, { useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useSelect } from 'react-select-search'
import Fuse from 'fuse.js'
import qs from 'query-string'
import ReactImageFallback from 'react-image-fallback'
// import DetectableOverflow from 'react-detectable-overflow';

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
  max-height: ${({amount}) => `calc(400px / ${amount})`};
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
  grid-template-columns: 40px 1fr 4fr;
  height: 30px;
  width: 100%;
  border: none;
  outline: none;
  background-color: ${props => props.selected ? 'rgba(91, 96, 204, 0.35)' : 'rgba(91, 96, 204, 0.15)'};

  font-size: 14px;
  color: white;
  padding-left: 10px;
  line-height: 30px;
  align-items: center;

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

const GroupRow = styled.div`
  display: block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 11px;
  text-align: center;
  padding-left: 10px;
  color: #FFFFFF;
  background: linear-gradient(91.77deg, #DA316B -97.86%, #1175DE 97.84%);
  border: 1px solid rgba(146, 119, 224, 0.5);
  cursor: default;
  text-transform: uppercase;
`

const IconWrapper = styled(ReactImageFallback)`
  display: flex;
  width: 20px;
  height: auto;
`

const NoResult = styled(OptionRow)`
  display: block;
  text-align: center;
  align-text: center;
`

function parseSectorName(sector) {
  switch (sector.toUpperCase()) {
    case 'STOCK' || 'XDAI-STOCK':
      return 'STOCKS / COMMODITIES'
    case 'XDAI-CRYPTO':
      return 'CRYPTO'
    default:
      return 'STOCKS / COMMODITIES'
  }
}

export const SearchBar = ({ focus }) => {
  const { location, push } = useHistory()
  const conducted = useConductedState()
  const details = useDetailsState()
  const base = useBaseState()

  const options = useMemo(() => {
    if (!details) return
    const groups = conducted.data.reduce((acc, synth) => {
      const props = details.data[synth.id]
      const sector = parseSectorName(props.sector)
      if (!acc[sector]) {
        acc[sector] = {
          type: 'group',
          name: sector,
          items: [],
        }
      }
      acc[sector].items.push({
        name: props.name,
        value: props.symbol,
      })
      return acc
    }, {})
    return Object.values(groups).map(group => {
      return {
        ...group,
        items: group.items.sort((a, b) => a.value.localeCompare(b.value))
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot.value])

  return (
    <Wrapper>
      <InputWrapper>
        <Input
          {...valueProps}
          value={snapshot.search}
          placeholder={'Search stocks, commodities & crypto'}
          autoFocus={focus}
        />
        <SearchIcon style={{ alignSelf: 'center', marginRight: '5px'}}/>
      </InputWrapper>
      {(snapshot.focus || focus) && (
        <>
          {snapshot.options.map(group => (
            <OptionsWrapper key={group.groupId} amount={snapshot.options.length}>
              <GroupRow>{group.name}</GroupRow>
              {group.items.map((option, i) => (
                // <DetectableOverflow onChange={(isOverflowed) => {}}>
                // </DetectableOverflow>
                // https://levelup.gitconnected.com/lazy-loading-images-in-react-for-better-performance-5df73654ea05
                  <OptionRow
                    key={option.value}
                    {...optionProps}
                    value={option.value}
                    selected={option.value.toUpperCase() === base?.symbol.toUpperCase()}
                  >
                    {/*<IconWrapper
                      src={`/images/tickers/${option.value.toUpperCase()}.png`}
                      fallbackImage={'/images/fallback/ticker.png'}
                      initialImage={'/images/fallback/ticker.png'}
                      alt={`${option.value} Symbol Logo`}
                    />*/}
                    <div></div>
                    <div>{option.value}</div>
                    <div>{option.name}</div>
                  </OptionRow>
              ))}
            </OptionsWrapper>
          ))}
          {!snapshot.options.length && (
            <NoResult>No Results Found</NoResult>
          )}
        </>
      )}
    </Wrapper>
  )
}

function fuzzySearch(options) {
  const groupNames = options.map(option => option.name)
  const mergedOptions = [].concat.apply([], options.map(group => {
    return group.items.map(item => {
      return {
        ...item,
        groupId: group.name
      }
    })
  }))
  const fuse = new Fuse(mergedOptions, {
    keys: [ 'name', 'value' ],
    threshold: 0.2,
  })

  return (value) => {
    if (!value.length) {
      return options
    }
    const result = fuse.search(value)
    const groups = result.reduce((acc, item) => {
      if (!acc[item.groupId]) {
        acc[item.groupId] = {
          type: 'group',
          name: item.groupId,
          items: []
        }
      }
      acc[item.groupId].items.push(item)
      return acc
    }, {})
    return Object.values(groups)
  }
}
