import React, { useState } from 'react'
import styled from 'styled-components'
import _ from 'lodash'

import {
  NetworkRow,
  SearchBar,
  Category,
  Table,
  TradeModal,
} from '../../components/App/Markets'

import { useSearchList } from '../../hooks/useSearchList'
import { SUPPORTED_CHAINS_AS_OPTIONS } from '../../constants'

const networkMapping = [{ name: 'All', short: 'ALL', value: 'ALL'}, ...SUPPORTED_CHAINS_AS_OPTIONS]

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin: 50px 10%;
`

const HeaderRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  gap: 10px;

  @media only screen and (max-width: 1040px) {
    flex-flow: column nowrap;
    & > * {
      justify-content: center;
      margin: 0 auto;
    }
  }
`

const TableWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  margin-top: 30px;

  & > * {
    &:first-child {
      margin-bottom: 5px;
    }
  }
`

const NoResults = styled.p`
  margin-top: 50px;  
  font-size: 15px;
  text-align: center;
`

export default function Markets () {
  // Related to Modal
  // TODO: turn this into react-redux so we dont have to pass state vars everywhere
  const [ showModal, setShowModal ] = useState(false)
  const [ symbol, setSymbol ] = useState(null)
  const [ name, setName ] = useState(null)
  const [ networks, setNetworks ] = useState([])

  const toggleModal = () => {
    setShowModal(prev => !prev)
  }

  // Related to Table
  const [ currentNetwork, setCurrentNetwork ] = useState(networkMapping[0].value)
  const [ snapshot, optionProps, searchProps ] = useSearchList(currentNetwork)

  return (
    <Container>
      <TradeModal
        showModal={showModal}
        toggleModal={toggleModal}
        symbol={symbol}
        name={name}
        networks={networks}
      />
      <HeaderRow>
        <NetworkRow
          networkMapping={networkMapping}
          currentNetwork={currentNetwork}
          onNetworkChange={(networkValue) => {
            const index = _.findIndex(networkMapping, { value: networkValue })
            setCurrentNetwork(networkMapping[index].value)
          }}
        />
        <SearchBar searchProps={searchProps} value={snapshot.search}/>
      </HeaderRow>
      {(snapshot.options.length > 0) ? snapshot.options.map((option, i) => (
        <TableWrapper key={i}>
          <Category name={option.name}/>
          <Table
            data={option.items}
            currentNetwork={currentNetwork}
            toggleModal={toggleModal}
            setSymbol={setSymbol}
            setName={setName}
            setNetworks={setNetworks}
          />
        </TableWrapper>
      )) : (
        <NoResults>
          No Results Found
        </NoResults>
      )}
    </Container>
  )
}
