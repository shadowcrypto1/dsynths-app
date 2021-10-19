import React, { useRef } from 'react'
import styled from 'styled-components'
import { Star} from 'react-feather'
import { FixedSizeList as List } from 'react-window'

import { useSearchList } from '../../../hooks/useSearchList'
import { useToggleFavorite } from '../../../state/favorites/hooks'
import { useBaseState } from '../../../state/base/hooks'
import { Search as SearchIcon } from '../../Icons'

const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-flow: column nowrap;
  & > * {
    &:not(:first-child) {
      margin-top: 8px;
      flex-grow: 1;
    }
  }
`

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  background: #DEDFEC;
  border: 1px solid #CECECE;
  border-radius: 5px;
  height: 30px;
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

const GroupsContainer = styled.div`
  display: grid;
  grid-template-rows: ${({n}) => n && `
    repeat(${n}, 1fr)
  `};
  grid-gap: 8px;
`

const GroupWrapper =styled.div`
  display: block;
  position: relative;
  padding-bottom: 4px;
  border-radius: 10px;
  background-color: #292A50;
  overflow: hidden; /* enable inner border radius */
`

const GroupHeader = styled.div`
  display: block;
  position: sticky;
  top: 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 11px;
  text-align: center;
  padding-left: 10px;
  color: #FFFFFF;
  background: linear-gradient(109.2deg, #532EE6 2.09%, #6A3EA6 99.42%), #292A50;
  cursor: default;
  text-transform: uppercase;
`


const GroupRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.showFavorite ? '35px 1fr 4fr' : '1fr 4fr'};
  height: 30px;
  line-height: 30px;
  width: 100%;
  border: none;
  outline: none;
  background-color: ${props => props.selected ? 'rgba(94, 75, 169, 0.2)' : 'inherit'};

  font-size: 14px;
  color: white;
  align-items: center;

  &:hover {
    & > * {
      background-color: rgba(94, 75, 169, 0.2);
      cursor: pointer;
    }
  };

  & > * {
    display: flex;
    background-color: inherit;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;

    &:first-child {
      display: flex;
      text-align: center;
      justify-content: center;
      align-items: center;
    }
  }
`

const GroupItem = styled(GroupRow).attrs({
  as: 'button'
})``


const EmptyGroup = styled(GroupHeader)`
  display: block;
  text-align: center;
  align-text: center;
  border-radius: 8px;
`

const SearchBar = ({ searchProps, value, focus }) => {
  return (
    <InputWrapper>
      <Input
        {...searchProps}
        value={value}
        placeholder={'Search stocks, commodities & crypto'}
        autoFocus={focus}
      />
      <SearchIcon style={{ alignSelf: 'center', marginRight: '5px'}} color={'#000000'}/>
    </InputWrapper>
  )
}

const GroupItems = ({ items, symbol, optionProps, focus, toggleFavorite, height }) => {
  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={30}
      initialScrollOffset={0}
      itemData={items}
    >
      {({ data, index, style }) => {
        const { value, name, favorite } = data[index]
        return (
          <GroupRow
            key={value}
            value={value}
            selected={value === symbol}
            showFavorite={focus}
            style={style}
            {...optionProps}
          >
            {focus && (
              <GroupItem onClick={() => toggleFavorite(name)}>
                <Star
                  style={{background: 'transparent'}}
                  size={'14'}
                  stroke={'1px'}
                  fill={favorite ? 'gold' : ''}
                />
              </GroupItem>
            )}
            <GroupItem value={value} onClick={(evt) => optionProps.onMouseDown(evt)}>{value}</GroupItem>
            <GroupItem value={value} onClick={(evt) => optionProps.onMouseDown(evt)}>{name}</GroupItem>
          </GroupRow>
        )
      }}
    </List>
  )
}

export const SearchList = ({ focus }) => {
  const base = useBaseState()
  const toggleFavorite = useToggleFavorite()
  const [
    snapshot,
    optionProps,
    searchProps,
  ] = useSearchList()

  return (
    <Wrapper>
      <SearchBar searchProps={searchProps} value={snapshot.search} focus={focus}/>
      {(snapshot.focus || focus) && (
        <GroupsContainer n={snapshot.options.length}>
          {snapshot.options.map(group => (
            <GroupWrapper key={group.groupId}>
              <GroupHeader>{group.name}</GroupHeader>
              <GroupItems
                items={group.items}
                symbol={base?.symbol}
                optionProps={optionProps}
                focus={focus}
                toggleFavorite={toggleFavorite}
                height={(392 / snapshot.options.length) ?? 392} // this number is hardcoded because of how <List/> works
              />
            </GroupWrapper>
          ))}
          {!snapshot.options.length && (
            <EmptyGroup>No Results</EmptyGroup>
          )}
        </GroupsContainer>
      )}
    </Wrapper>
  )
}
