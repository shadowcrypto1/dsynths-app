import React from 'react'
import styled from 'styled-components'
import { Star} from 'react-feather'

import { useSearchList } from '../../../hooks/useSearchList'
import { useToggleFavorite } from '../../../state/favorites/hooks'
import { useBaseState } from '../../../state/base/hooks'
import { Search as SearchIcon } from '../../Icons'

const Wrapper = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 8px;
`

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  background: #DEDFEC;
  border: 1px solid #CECECE;
  border-radius: 8px;
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

const OptionsContainer = styled.div`
  overflow: auto;
  padding-bottom: 4px;
  list-style: none;
  border-radius: 10px;
  background-color: #292A50;
`

const OptionsWrapper = styled.div`
  overflow: auto;
  max-height: ${({amount}) => `calc(510px / ${amount})`};
  list-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const GroupRow = styled.div`
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

const OptionRow = styled.div`
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

const OptionItem = styled(OptionRow).attrs({
  as: 'button'
})``

const NoResult = styled(OptionRow)`
  display: block;
  text-align: center;
  align-text: center;
  border-radius: 8px;
`

export const SearchBar = ({ focus }) => {
  const base = useBaseState()
  const toggleFavorite = useToggleFavorite()
  const [
    snapshot,
    optionProps,
    searchProps,
  ] = useSearchList()

  return (
    <Wrapper>
      <InputWrapper>
        <Input
          {...searchProps}
          value={snapshot.search}
          placeholder={'Search stocks, commodities & crypto'}
          autoFocus={focus}
        />
        <SearchIcon style={{ alignSelf: 'center', marginRight: '5px'}} color={'#000000'}/>
      </InputWrapper>
      {(snapshot.focus || focus) && (
        <>
          {snapshot.options.map(group => (
            <OptionsContainer key={group.groupId}>
              <OptionsWrapper amount={snapshot.options.length}>
                <GroupRow>{group.name}</GroupRow>
                {group.items.map((option, i) => {
                  const { value, name, favorite } = option
                  return (
                    <OptionRow
                      key={value}
                      value={value}
                      selected={value.toUpperCase() === base?.symbol.toUpperCase()}
                      showFavorite={focus}
                    >
                      {focus && (
                        <OptionItem onClick={() => toggleFavorite(name)}>
                          <Star
                            style={{background: 'transparent'}}
                            size={'14'}
                            stroke={'1px'}
                            fill={favorite ? 'gold' : ''}
                          />
                        </OptionItem>
                      )}
                      <OptionItem value={value} onClick={(evt) => optionProps.onMouseDown(evt)} {...optionProps}>{value}</OptionItem>
                      <OptionItem value={value} onClick={(evt) => optionProps.onMouseDown(evt)} {...optionProps}>{name}</OptionItem>
                    </OptionRow>
                  )
                })}
              </OptionsWrapper>
            </OptionsContainer>
          ))}
          {!snapshot.options.length && (
            <NoResult>No Results Found</NoResult>
          )}
        </>
      )}
    </Wrapper>
  )
}
