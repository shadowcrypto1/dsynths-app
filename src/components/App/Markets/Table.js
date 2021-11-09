import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import ReactImageFallback from 'react-image-fallback'

import { Pagination } from './Pagination'
import { useQuotesState } from '../../../state/quotes/hooks'
import { formatDollarAmount } from '../../../utils/numbers'

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  background: #292A50;
  border: 1px solid #12092C;
  box-sizing: border-box;
  border-radius: 0px 0px 5px 5px;
  min-height: 304px; /* hardcoded because a non-complete page will shift the height */
`

const TableWrapper = styled.table`
  width: 100%;
  overflow: hidden;
  table-layout: fixed;
  border-collapse: collapse;

  & > tbody {
    & > tr {
      &:nth-child(even) {
        background: transparent;
      }

      &:nth-child(odd) {
        background: #242657;
      }

      &:not(:first-child):not(:last-child) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }
    }
  }
`

const Head = styled.thead`
  & > tr {
    height: 29px;
    background: black;
    font-size: 13px;
    line-height: 15px;
  }
`

const Row = styled.tr`
  align-items: center;
  height: 21px;
  font-size: 10px;
  line-height: 12px;
  color: #FFFFFF;
  overflow: hidden;
  white-space: nowrap;
`

const Cel = styled.td`
  text-align: ${props => props.justify ?? 'center'};
  justify-content: ${props => props.justify ?? 'center'};
  align-text: center;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;

  /* set width of ticker symbol */
  :first-child {
    width: 100px;
  }

  @media screen and (max-width: 767px) {
    &:nth-of-type(4) {
      display: none;
    }
  }

  @media screen and (max-width: 480px) {
    &:nth-of-type(1) {
      max-width: 50px;
    }
    &:nth-of-type(2) {
      display: none;
    }
  }
`

const Icon = styled(ReactImageFallback)`
  display: flex;
  width: 15px;
  height: auto;
  margin-left: auto;
  margin-right: auto;
`

const TradeButton = styled.div`
  display: flex;
  height: 13px;
  width: 50px;
  margin-left: auto;
  margin-right: auto;
  font-size: 8px;
  text-align: center;
  color: #FFFFFF;
  text-decoration: none;
  justify-content: center;
  background: #693DAA;
  border: 1px solid #53239B;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.25);
  border-radius: 2px;

  &:hover {
    cursor: pointer;
  }
`

export const Table = ({
  data: dataMapping,
  currentNetwork,
  toggleModal,
  setSymbol,
  setName,
  setNetworks,
}) => {
  const amountPerPage = 10
  const [ offset, setOffset ] = useState(0)
  const quotes = useQuotesState()

  const data = useMemo(() => {
    return dataMapping ?? []
  }, [dataMapping])

  useEffect(() => {
    setOffset(0)
  }, [dataMapping])

  const paginatedData = useMemo(() => {
    const slice = data.slice(offset, offset + amountPerPage)
    return slice.map(asset => {
      let mappedPrices = quotes.status !== 'OK'
        ? []
        : quotes?.data[asset.value] ?? []
      mappedPrices = mappedPrices.map(o => o.long?.price).filter(n => n)

      let price = mappedPrices.length > 0 ? formatDollarAmount(mappedPrices[0]) : 'Market Closed'
      return {
        ...asset,
        symbol: asset.value,
        name: asset.name,
        price: price
      }
    })
  }, [data, offset, quotes])

  const pageCount = useMemo(() => {
    return Math.ceil(data.length / amountPerPage)
  }, [data])

  const onPageChange = ({ selected }) => {
    setOffset(Math.ceil(selected * amountPerPage))
  }

  return (
    <Wrapper>
      <TableWrapper>
        <Head>
          <Row>
            <Cel></Cel>
            <Cel justify='left'>Symbol</Cel>
            <Cel justify='left'>Name</Cel>
            <Cel>Price</Cel>
            {/*<Cel>24h Short Vol</Cel>
            <Cel>24h Long Vol</Cel>*/}
            <Cel>Trade</Cel>
          </Row>
        </Head>
        <tbody>
          {paginatedData && paginatedData.map((asset, index) => (
            <Row key={index}>
              <Cel>
                <Icon
                  src={`/images/tickers/${asset.symbol.toUpperCase()}.png`}
                  fallbackImage={'/images/fallback/ticker.png'}
                  alt={`${asset.symbol} asset logo`}
                />
              </Cel>
              <Cel justify='left'>{asset.symbol}</Cel>
              <Cel justify='left'>{asset.name}</Cel>
              <Cel>{asset.price}</Cel>
              {/*<Cel>-</Cel>
              <Cel>-</Cel>*/}
              <Cel>
                {currentNetwork === 'ALL' ? (
                  <TradeButton
                    onClick={() => {
                      toggleModal()
                      setSymbol(asset.symbol)
                      setName(asset.name)
                      setNetworks(asset.networks)
                    }}
                  >Trade</TradeButton>
                ) : (
                  <Link href={`/exchange/basic?symbol=${asset.symbol}&network=${currentNetwork}`} style={{textDecoration: 'none'}}>
                    <TradeButton>Trade</TradeButton>
                  </Link>
                )}
              </Cel>
            </Row>
          ))}
        </tbody>
      </TableWrapper>
      {paginatedData.length > 0 && <Pagination pageCount={pageCount} onPageChange={onPageChange}/>}
    </Wrapper>
  )
}
