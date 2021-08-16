import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { ResponsiveContainer, YAxis, AreaChart, Area } from 'recharts'

import { useLineChart } from '../../../hooks/useLineChart'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  background: ${({isDesktop}) => !isDesktop ? '#30315D' : 'linear-gradient(0.32deg, #30315D 0.26%, #30315D 47.94%, rgba(48, 49, 93, 0.86) 61.84%, rgba(48, 49, 93, 0) 99.71%), linear-gradient(109.2deg, #532EE6 2.09%, #6A3EA6 99.42%)'};
  border-radius: 10px;
  overflow: hidden;
`

const HeaderContainer = styled.div`
  display: block;
  width: 100%;
  height: auto;
  padding: 19px;
`

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  ${({ isDesktop }) =>  isDesktop && `
    padding-bottom: 10px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  `};
`

const HeaderSection = styled.div`
  display: grid;
  grid-direction: column;
`

const HeaderUpper = styled.div`
  display: block;
  font-size: 30px;
  line-height: 30px;
  color: white;
  width: 100%;
`

const HeaderBottom = styled.div`
  display: block;
  font-size: 12px;
  line-height: 12px;
  color: white;
  width: 100%;
`

const ChartContainer = styled(ResponsiveContainer)`
  ${({hasNoData}) => hasNoData && `
    position: relative;
    &:after {
      content: "No Data Available";
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

  ${({loading}) => loading && `
    position: relative;
    &:after {
      content: 'Loading...';
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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  bottom: 30px;
  height: 30px;
  background: ${({hasNoData}) => hasNoData ? 'transparent' : 'rgba(121, 219, 233, 0.1)'};
  opacity: 0.6;
`

const Button = styled.button`
  display: flex;
  margin: 0 2.5px;
  justify-content: center;
  align-items: center;
  text-align: center;

  font-size: 10px;
  height: 20px;
  line-height: 20px;
  width: 30px;

  color: #FFFFFF;
  background: black;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  box-shadow: 0px 0px 4px rgba(65, 148, 43, 0.2);
  opacity: ${props => props.selected ? '1' : '0.5'};

  &:hover {
    cursor: pointer;
  }
`

const buttonMapping = [
  { value: 'd', text: '1D', noun: 'Day' },
  { value: 'w', text: '1W', noun: 'Week' },
  { value: 'm', text: '1M', noun: 'Month' },
  { value: 'y', text: '1Y', noun: 'Year' },
]

export const Hero = ({ symbol, name, isDesktop }) => {
  const wrapperRef = useRef(null)
  const [ selectedTimeframe, setSelectedTimeframe ] = useState(buttonMapping[3].value)
  const [ noun, setNoun ] = useState(buttonMapping[3].noun)
  const { data, loading, hasNoData } = useLineChart(symbol, selectedTimeframe)

  const [ priceLabel, setPriceLabel ] = useState(null)
  const [ changeLabel, setChangeLabel ] = useState(null)

  useEffect(() => {
    let priceLabelResult = null
    let changeLabelResult = null

    if (data && data.length > 1) {
      const currentPrice = data[data.length - 1].close
      const zeroDayPrice = data[0].close
      const change = ((currentPrice - zeroDayPrice) / zeroDayPrice * 100).toFixed(2)

      priceLabelResult = `$${currentPrice.toFixed(2)}`
      changeLabelResult = `${change >= 0 ? '+' : ''}${change}% Past ${noun}`
    }

    setPriceLabel && setPriceLabel(priceLabelResult)
    setChangeLabel && setChangeLabel(changeLabelResult)
  }, [symbol, data, noun])

  return (
    <Wrapper isDesktop={isDesktop}>
      <HeaderContainer>
        <HeaderWrapper isDesktop={isDesktop}>
          <HeaderSection>
            <HeaderUpper>{symbol}</HeaderUpper>
            <HeaderBottom>{name}</HeaderBottom>
          </HeaderSection>
          <HeaderSection style={{textAlign: 'right'}}>
            <HeaderUpper>{priceLabel}</HeaderUpper>
            <HeaderBottom>{changeLabel}</HeaderBottom>
          </HeaderSection>
        </HeaderWrapper>
      </HeaderContainer>
      {(isDesktop) && (
        <div ref={wrapperRef} style={{display: 'block', height: '200px'}}>
          <ChartContainer width='100%' height={'100%'} hasNoData={hasNoData} loading={loading}>
            <AreaChart
              width={wrapperRef?.current?.offsetWidth ?? 200}
              height={wrapperRef?.current?.offsetHeight ?? 200}
              data={data.length ? data : []}
              margin={{
                bottom: 30,
              }}
            >
              <YAxis dataKey='close' type="number" domain={['dataMin', 'dataMax']} hide={true}/>
              <Area dataKey="close" type="monotone" stroke='#00D16C' fill="rgba(121, 219, 233, 0.1)" strokeWidth={1} />
            </AreaChart>
          </ChartContainer>
          <ButtonWrapper hasNoData={hasNoData}>
            {buttonMapping.map(item => (
              <Button
                key={item.value}
                selected={item.value === selectedTimeframe}
                isDesktop={isDesktop}
                onClick={() => {
                  !loading && setSelectedTimeframe(item.value)
                  !loading && setNoun(item.noun)
                }}
              >{item.text}</Button>
            ))}
          </ButtonWrapper>
        </div>
      )}
    </Wrapper>
  )
}
