import { useEffect, useState, useCallback } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { getStockCandles } from '../utils/stocks'
dayjs.extend(utc)

const getParams = (timeframe) => {
  let result = {}

  switch (timeframe) {
    case 'd':
      result = {
        resolution: '15',
        from: dayjs().utc().subtract(1, 'day').unix() - 1
      }
      break
    case 'w':
      result = {
        resolution: '60',
        from: dayjs().utc().subtract(7, 'days').unix()
      }
      break
    case 'm':
      result = {
        resolution: '60',
        from: dayjs().utc().subtract(30, 'days').unix()
      }
      break
    case 'y':
      result = {
        resolution: 'D',
        from: dayjs().utc().subtract(1, 'year').unix()
      }
      break
    default:
      result = {
        resolution: '60',
        from: dayjs().utc().subtract(1, 'day').unix()
      }
  }
  result['to'] = dayjs().utc().endOf('day').unix() - 1
  return result
}

export const useLineChart = (baseSymbol, timeframe) => {
  const [ hasNoData, setHasNoData ] = useState(false)
  const [ data, setData ] = useState([])

  const fetchPrices = useCallback(async () => {
    let mounted = true
    
    const { resolution, from, to} = getParams(timeframe)
    const result = await getStockCandles(baseSymbol, resolution, from, to)
    mounted && setData(result)
    mounted && setHasNoData(!result.length)

    return () => mounted = false
  }, [baseSymbol, timeframe])

  useEffect(() => {
    fetchPrices()
  }, [baseSymbol, timeframe])

  return {
    data,
    hasNoData
  }
}
