import { intervalMapping, getStockCandles } from "../../utils/stocks"

export default class Datafeed {
	constructor({ ticker }) {
		this.ticker = ticker
		this.lastBarsCache = new Map();
	}

	onReady(callback) { callback() }

	async resolveSymbol (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
		console.log('[resolveSymbol]: Method call', symbolName);
		onSymbolResolvedCallback({
				name: `${this.ticker}:USD`,
				description: `${this.ticker}:USD`,
				type: "stocks",
				symbol: this.ticker,
				pair: "USD",
				session: '24x7',
				timezone: 'Etc/UTC',
				exchange: "Finnhub",
				minmov: 1,
				pricescale: 100,
				minmove2: 0,
				has_no_volume: true,
				// has_intraday: true,
				// has_daily: true,
				// has_weekly_and_monthly: true,
				// supported_resolutions: Object.keys(intervalMapping),
		});
	}

	async getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
		console.log('[getBars]: Method call', symbolInfo, resolution, from, to);
		try {
			const bars = await getStockCandles(symbolInfo.symbol, resolution, from, to)
			if (!bars.length) return onHistoryCallback([], { noData: true })

			if (firstDataRequest) {
				this.lastBarsCache.set(symbolInfo.symbol, {
					...bars[bars.length - 1],
				});
			}
			console.log(`[getBars]: returned ${bars.length} bar(s)`);
			onHistoryCallback(bars, {	noData: false });
		} catch (error) {
			console.log('[getBars]: Get error', error);
			onErrorCallback(error);
		}
	}

	subscribeBars (symbolInfo,	resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) {
		console.log('[subscribeBars]: Method call with subscribeUID:', subscribeUID);
	}
	unsubscribeBars (subscriberUID) {
		console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
	}
}
