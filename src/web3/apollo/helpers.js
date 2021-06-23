// import {round} from "@qc/date-round";
// import _ from "lodash";
//
// // swaps are [ newest, oldest ]
// export const transformSwapsIntoBars = (swaps, interval, from, to) => {
//   try {
//     if (!swaps) throw new Error("[swap] is missing, note that empty arrays are still valid")
//     if (!interval) throw new Error("[interval] is missing")
//
//     swaps = simplifySwaps(swaps)
//
//     const intervalInSeconds = {
//       "1m": 60,
//       "15": 900,
//       "1h": 3600,
//       "60": 3600,
//       "1d": 3600 * 24,
//       "1D": 3600 * 24,
//     }[interval]
//     if (!intervalInSeconds) throw new Error("unable to map [intervalInSeconds]")
//
//     const openTimes = getOpenTimes({
//       intervalInSeconds: intervalInSeconds,
//       from: from,
//       to: to,
//     })
//
//     const batchedSwaps = batchSwapsPerDuration(swaps, openTimes, intervalInSeconds)
//
//     // Process all closed candles & ignore the currently open candle (the last key in batchedSwaps)
//     const unclosedCandlestickKey = Object.keys(batchedSwaps).pop()
//     let previousCandlestick = null
//
//     let builtCandlesticks = []
//     Object.entries(batchedSwaps).forEach(batch => {
//       let [ timestamp, group ] = batch
//       timestamp = Number(timestamp)
//
//       if (timestamp == unclosedCandlestickKey) return // ignore the unclosed candle
//       const swapsInThisCandlestick = batchedSwaps[timestamp]
//       if (!previousCandlestick && !swapsInThisCandlestick.length) return
//       const candlestick = buildCandlestick({
//         openTime: timestamp,
//         swapsInThisCandlestick,
//         previousCandlestick,
//       })
//       builtCandlesticks.push(candlestick)
//       previousCandlestick = candlestick
//     });
//     return builtCandlesticks
//   } catch (err) {
//     console.error(err);
//     return []
//   }
// }
//
// // TODO: this is only uniswap
// function simplifySwaps (swaps) {
//   return swaps.reduce((acc, swap) => {
//     const amount0In = Number(swap.amount0In)
//     const amount0Out = Number(swap.amount0Out)
//     const amount1In = Number(swap.amount1In)
//     const amount1Out = Number(swap.amount1Out)
//     const amountUSD = Number(swap.amountUSD)
//
//     let tokenAmount
//     let pairAmount
//
//     if (amount0In == 0) { // Buying the token
//       tokenAmount = amount0Out
//       pairAmount = amount1In
//     } else { // Selling the token
//       tokenAmount = amount0In
//       pairAmount = amount1Out
//     }
//
//     // rare ocassion where a tx value is 0
//     if (tokenAmount == 0 || pairAmount == 0) return acc
//
//     acc.push({
//       price: Number((tokenAmount/pairAmount).toFixed(10)),
//       volume: pairAmount,
//       token0: {
//         contract: swap.pair.token0.id,
//         symbol: swap.pair.token0.symbol,
//       },
//       token1: {
//         contract: swap.pair.token1.id,
//         symbol: swap.pair.token1.symbol,
//       },
//       hash: swap.transaction.id,
//       timestamp: Number(swap.transaction.timestamp),
//     })
//     return acc
//   }, [])
// }
//
// function buildCandlestick({
//   openTime = null,
//   swapsInThisCandlestick = [], // can actually be empty
//   previousCandlestick = null, // can actually be null
// } = {}) {
//   try {
//     if (!openTime) throw new Error("param [openTime] is missing")
//     if (!swapsInThisCandlestick.length && !previousCandlestick) throw new Error("It is impossible for the swapsInThisCandlestick to be empty & the previousCandlestick to be null")
//
//     let blockNumber, time, open, high, low, close, volume
//     if (!swapsInThisCandlestick.length) {
//       open        = previousCandlestick.close
//       high        = previousCandlestick.close
//       low         = previousCandlestick.close
//       close       = previousCandlestick.close
//       volume      = 0
//     } else if (!previousCandlestick){
//       open        = swapsInThisCandlestick[0].price
//       high        = (_.maxBy(swapsInThisCandlestick, (swap) => swap.price)).price
//       low         = (_.minBy(swapsInThisCandlestick, (swap) => swap.price)).price
//       close       = swapsInThisCandlestick[swapsInThisCandlestick.length - 1].price
//       volume      = _.sumBy(swapsInThisCandlestick, (swap) => swap.volume)
//     } else {
//       open        = previousCandlestick.close
//       high        = (_.maxBy(swapsInThisCandlestick, (swap) => swap.price)).price
//       low         = (_.minBy(swapsInThisCandlestick, (swap) => swap.price)).price
//       close       = swapsInThisCandlestick[swapsInThisCandlestick.length - 1].price
//       volume      = _.sumBy(swapsInThisCandlestick, (swap) => swap.volume)
//     }
//
//     return {
//       time: openTime * 1000, // demanded by tradingview
//       open,
//       high,
//       low,
//       close,
//       volume
//     }
//   } catch (err) {
//     throw err
//   }
// }
//
// function getOpenTimes({
//   intervalInSeconds = null,
//   from = null,
//   to = null
// }) {
//   try {
//     if (!from) throw new Error("param [from] is missing")
//     if (!to) throw new Error("param [to] is missing")
//
//     // When building candlesticks we're counting backwards so the timestamps are according to the interval times in UTC
//     let nearestOpenTime = (round(to, intervalInSeconds).getTime()) // in seconds, note that this can also be a future timestamp
//     if (nearestOpenTime > to) nearestOpenTime -= intervalInSeconds
//
//     const openTimes = []
//     while (nearestOpenTime > from) { // the first openTime after the last recorded candle, ">" is CRUCIAL instead of ">="
//       openTimes.push(nearestOpenTime)
//       nearestOpenTime -= intervalInSeconds
//     }
//
//     // Flip openTimes so we can loop from the past until now
//     return openTimes.reverse()
//   } catch (err) {
//     throw err
//   }
// }
//
// function batchSwapsPerDuration(originalSwaps, openTimes, intervalInSeconds) {
//   try {
//     if (!originalSwaps || !openTimes || !intervalInSeconds) throw new Error("Params are missing")
//     const swaps = [...originalSwaps] // cloning here because it alters the original array
//
//     const swapsByOpentime = {}
//     // don't try to understand what's going on here, neither do it but it works
//     openTimes.forEach((openTime, index) => {
//         let b = swaps.filter(swap => swap.timestamp < openTime + intervalInSeconds)
//       b.forEach(() => swaps.splice(swaps.findIndex(swap => swap.timestamp < openTime + intervalInSeconds), 1)) // this alters the original transactions array
//       swapsByOpentime[openTime] = []
//       swapsByOpentime[openTime] = b
//     });
//     return swapsByOpentime
//   } catch (err) {
//     throw err
//   }
// }
