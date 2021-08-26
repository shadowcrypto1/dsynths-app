import { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const getParams = (timeframe) => {
  let result = {};

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
  result["to"] = dayjs().utc().endOf("day").unix() - 1;
  return result;
};

const getStockCandles = async (symbol, resolution, from, to) => {
  const response = await fetch(
    `http://localhost:5000/prices?${new URLSearchParams({
      symbol,
      resolution,
      from,
      to,
    }).toString()}`,
    {
      mode: "cors",
      headers: {
        Origin: "http://localhost:3000",
      },
    }
  );
  debugger;
  const stockCandles = await response.json();
  return stockCandles;
};

export const useLineChart = (baseSymbol, timeframe) => {
  const [hasNoData, setHasNoData] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrices = useCallback(async () => {
    let mounted = true
    const { resolution, from, to} = getParams(timeframe)
    const result = await getStockCandles(baseSymbol, resolution, from, to)

    if (!mounted) return
    setData(result)
    setHasNoData(!result.length || result.length < 2) // filter single plots
    setLoading(false)

    return () => mounted = false
  }, [baseSymbol, timeframe])

  useEffect(() => {
    setLoading(true)
    fetchPrices()
  }, [baseSymbol, timeframe, fetchPrices])

  return {
    data,
    loading,
    hasNoData,
  };
};
