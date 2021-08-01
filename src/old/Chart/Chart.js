import React, { useContext } from 'react'
import styled from 'styled-components'

import { ThemeContext } from '../../../../context/ThemeContext'
import { TVChartContainer } from '../../../TVChartContainer'
import { Card } from '../../../Card'

import { widgetOptions as getWidgetOptions } from './widgetOptions'
import Datafeed from './datafeed'

const ChartWrapper = styled(Card)`
  padding: 5px; /* additional padding because the chart instance has no border-radius */
  background: ${props => props.theme === 'light' ? '#FFFFFF' : 'var(--c-bg0)'}
`

export const Chart = ({ ticker }) => {
  const { theme } = useContext(ThemeContext)

  const datafeed = new Datafeed({ ticker })
  const widgetOptions = getWidgetOptions({ theme, datafeed, ticker })

  return (
    <ChartWrapper theme={theme}>
      {/*<TVChartContainer widgetOptions={widgetOptions} ticker={ticker}/>*/}
    </ChartWrapper>
  )
}
