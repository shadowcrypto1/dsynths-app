import * as finnhub from 'finnhub';
import { FinnhubQueue } from './queue';

const API_KEY = process.env.REACT_APP_FINNHUB_API_KEY;
const MISSING_KEY_ERROR = (!API_KEY)
  ? 'Finnhub API Key is missing. You can get a free one at: https://finnhub.io/. You can continue without one, but it is recommended to create one regardless'
  : null

finnhub.ApiClient.instance.authentications['api_key'].apiKey = API_KEY
const finnhubClient = new finnhub.DefaultApi()

export const intervalMapping = {
  // tradingview_identifier: finnhub_identifier
  "1m": "1",
  "1": "1",
  "5": "5",
  "5m": "5",
  "15": "15",
  "15m": "15",
  "30": "30",
  "30m": "30",
  "60": "60",
  "60m": "60",
  "D": "D",
  "1D": "D",
  "W": "W",
  "1W": "W",
  "M": "M",
  "1M": "M",
}

export const getStockSymbols = async () => {
  try {
    return await new Promise((resolve, reject) => {
      MISSING_KEY_ERROR && reject(MISSING_KEY_ERROR)
      FinnhubQueue.add(() => {
        finnhubClient.stockSymbols("US", (error, data, response) => {
          if (error) reject(error)
          resolve(data)
        })
      })
    }).catch(err => {throw err})
  } catch (err) {
    console.error(err)
    return []
  }
}

export const getStockCandles = async (symbol, resolution, from, to) => {
  try {
    const interval = intervalMapping[resolution]
    if (!interval) throw new Error(`Invalid resolution provided: ${resolution}`)

    const data = await new Promise((resolve, reject) => {
      MISSING_KEY_ERROR && reject(MISSING_KEY_ERROR)
      FinnhubQueue.add(() => {
        finnhubClient.stockCandles(symbol, interval, from, to, {}, (error, data, response) => {
          if (error) reject(error)
          resolve(data)
        })
      })
    })

    if (data.s == "no_data" || data.s != "ok") {
      console.info('[data] has returned 0 values for the requested range, this is either a bug or the requested dataset is out of range')
      return []
    }

    return reduceDataResponse(data, from, to)
  } catch (err) {
    console.error(err)
    return []
  }
}

const reduceDataResponse = (data, from, to) => {
  try {
    return data.t.reduce((acc, bar, index) => {
      if (bar <= from && bar > to) return acc;
      const obj = {
        time: bar * 1000,
        low: data.l[index],
        high: data.h[index],
        open: data.o[index],
        close: data.c[index],
        volume: data.v[index],
      };
      acc.push(obj);
      return acc;
    }, [])
  } catch (err) {
    console.error(err)
    return []
  }
}
