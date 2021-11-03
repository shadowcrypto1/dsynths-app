import { useEffect, useState, useCallback } from 'react'

const getStockCandles = async (symbol, assetType, timeframe) => {
  const response = await fetch(
    `http://localhost:4000/prices?${new URLSearchParams({
      assetType,
      symbol,
      timeframe,
    }).toString()}`,
    {
      mode: 'cors',
    },
  )
  if (!response.ok) return []
  const stockCandles = await response.json()
  return stockCandles
}

export const useLineChart = (baseSymbol, assetType, timeframe) => {
  const [hasNoData, setHasNoData] = useState(true)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPrices = useCallback(async () => {
    let mounted = true
    const result = await getStockCandles(baseSymbol, assetType, timeframe)

    if (!mounted) return
    setData(result)
    setHasNoData(!result.length || result.length < 2) // filter single plots
    setLoading(false)

    return () => (mounted = false)
  }, [baseSymbol, timeframe])

  useEffect(() => {
    setLoading(true)
    fetchPrices()
  }, [baseSymbol, timeframe, fetchPrices])

  return {
    data,
    loading,
    hasNoData,
  }
}
