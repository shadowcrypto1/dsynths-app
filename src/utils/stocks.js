import * as finnhub from 'finnhub'
import { FinnhubQueue } from './queue'

const API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY
const MISSING_KEY_ERROR = !API_KEY
  ? 'Finnhub API Key is missing. You can get a free one at: https://finnhub.io/. You can continue without one, but it is recommended to create one regardless'
  : null

finnhub.ApiClient.instance.authentications['api_key'].apiKey = API_KEY
const finnhubClient = new finnhub.DefaultApi()

export const intervalMapping = {
  // tradingview_identifier: finnhub_identifier
  '1m': '1',
  1: '1',
  5: '5',
  '5m': '5',
  15: '15',
  '15m': '15',
  30: '30',
  '30m': '30',
  60: '60',
  '60m': '60',
  D: 'D',
  '1D': 'D',
  W: 'W',
  '1W': 'W',
  M: 'M',
  '1M': 'M',
}

export const getStockSymbols = async () => {
  try {
    return await new Promise((resolve, reject) => {
      MISSING_KEY_ERROR && reject(MISSING_KEY_ERROR)
      FinnhubQueue.add(() => {
        finnhubClient.stockSymbols('US', (error, data) => {
          if (error) reject(error)
          resolve(data)
        })
      })
    }).catch((err) => {
      throw err
    })
  } catch (err) {
    console.info('Error fetching stock symbols:')
    console.error(err)
    return []
  }
}
