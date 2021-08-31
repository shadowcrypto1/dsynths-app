import { useEffect, useState, useCallback } from 'react'

const getStockCandles = async (symbol, timeframe) => {
  const response = await fetch(
    `http://localhost:5000/prices?${new URLSearchParams({
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

export const useLineChart = (baseSymbol, timeframe) => {
  const [hasNoData, setHasNoData] = useState(true)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPrices = useCallback(async () => {
    let mounted = true;
    const { resolution, from, to } = getParams(timeframe);
    const result = await getStockCandles(baseSymbol, resolution, from, to);

    if (!mounted) return;
    setData(result);
    setHasNoData(!result.length || result.length < 2); // filter single plots
    setLoading(false);

    return () => (mounted = false);
  }, [baseSymbol, timeframe]);

  useEffect(() => {
    setLoading(true);
    fetchPrices();
  }, [baseSymbol, timeframe, fetchPrices]);

  return {
    data,
    loading,
    hasNoData,
  }
}
