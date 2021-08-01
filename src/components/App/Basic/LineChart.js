import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { ResponsiveContainer, YAxis, AreaChart, Area } from 'recharts'

import { useLineChart } from '../../../hooks/useLineChart'

const Wrapper = styled.div`
  display: block;
  position: relative;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  background: #121212;
  border: 1px solid rgba(181, 206, 255, 0.25);
  border-radius: 10px;
  overflow: hidden;
`

const PriceWrapper = styled.div`
  display: grid;
  grid-direction: column;
  position: absolute;
  top: 15px;
  padding-left: 19px;
  width: 100%;
  height: 25px;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  width: 100%;
  bottom: 10px;
  height: 15px;
`

const Price = styled.div`
  display: block;
  width: 100%;
  height: 25px;
  font-size: 25px;
  line-height: 25px;
  color: #FFFFFF;
`

const PriceChange = styled.div`
  display: block;
  width: 100%;
  height: 20px;
  font-size: 12.5px;
  line-height: 20px;
  color: #00D16C;
`

const Button = styled.button`
  display: flex;
  width: 25px;
  height: 15px;
  opacity: ${props => props.selected ? '1' : '0.5'};
  font-size: 7.5px;
  line-height: 15px;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #FFFFFF;
  background: #0E1E1C;
  border: 1px solid rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 4px rgba(65, 148, 43, 0.2);
  border-radius: 3px;
  margin: 0 2.5px;

  &:hover {
    cursor: pointer;
  }
`

const CustomResponsiveContainer = styled(ResponsiveContainer)`
  ${({hasNoData}) => hasNoData && `
    position: relative;

    &:after {
      // content: "No Data Available";
      content: 'Widget currently disabled';
      display: flex;
      justify-content: center;
      width: 100%;
      height: 150px;
      position: absolute;
      top: 30%;
      opacity: 0.4;
      pointer-events: none;
    }
  `}
`

const buttonMapping = [
  { value: 'd', text: '1D', noun: 'Day' },
  { value: 'w', text: '1W', noun: 'Week' },
  { value: 'm', text: '1M', noun: 'Month' },
  { value: 'y', text: '1Y', noun: 'Year' },
]

export const LineChart = ({ baseSymbol }) => {
  const wrapperRef = useRef(null)
  const [ selectedTimeframe, setSelectedTimeframe ] = useState(buttonMapping[0].value)
  const [ noun, setNoun ] = useState(buttonMapping[0].noun)
  const { data, hasNoData } = useLineChart(baseSymbol, selectedTimeframe)

  const [ priceLabel, setPriceLabel ] = useState(null)
  const [ changeLabel, setChangeLabel ] = useState(null)

  useEffect(() => {
    let priceLabelResult = null
    let changeLabelResult = null

    if (data && data.length > 1) {
      const currentPrice = data[data.length - 1].close
      const zeroDayPrice = data[0].close
      const change = ((currentPrice - zeroDayPrice) / zeroDayPrice * 100).toFixed(2)

      priceLabelResult = `$${currentPrice}`
      changeLabelResult = `${change >= 0 ? '+' : ''}${change}% Past ${noun}`
    }

    setPriceLabel && setPriceLabel(priceLabelResult)
    setChangeLabel && setChangeLabel(changeLabelResult)
  }, [baseSymbol, data, noun])

  return (
    <Wrapper ref={wrapperRef}>
      <PriceWrapper>
        <Price>{priceLabel}</Price>
        <PriceChange>{changeLabel}</PriceChange>
      </PriceWrapper>
      <CustomResponsiveContainer width='100%' height='100%' hasNoData={hasNoData}>
        <AreaChart
          width={wrapperRef?.current?.offsetWidth || 200}
          height={wrapperRef?.current?.offsetHeight || 200}
          data={data.length ? data : []}
          margin={{
            top: 65, // below the stats
          }}
        >
          <YAxis dataKey='close' type="number" domain={['dataMin', 'dataMax']} hide={true} />
          <Area dataKey="close" type="monotone" stroke='#00D16C' fill="rgba(121, 219, 233, 0.1)" strokeWidth={1} />
        </AreaChart>
      </CustomResponsiveContainer>
      <ButtonWrapper>
        {buttonMapping.map(item => (
          <Button
            key={item.value}
            selected={item.value === selectedTimeframe}
            onClick={() => {
              setSelectedTimeframe(item.value)
              setNoun(item.noun)
            }}
          >{item.text}</Button>
        ))}
      </ButtonWrapper>
    </Wrapper>
  )
}
