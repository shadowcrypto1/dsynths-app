import Bottleneck from 'bottleneck'

// Finnhub API rate limits at 300 calls/minute && 30 calls/sec
class Queue {
	constructor() {
		this.limiter = new Bottleneck({
			/**
       * Original MAX values => needed for server-side requests.
       * TODO: build a back-end that does exactly this (for production), essentially
       * removing client-side fetches (so our API KEY doesn't get destroyed)
       */
			reservoir: 300, // 300 per minute
			reservoirRefreshAmount: 300, // reset to 300 when the minute has passed
			reservoirRefreshInterval: 60 * 1000, // the 'per minute', must be divisible by 250
			maxConcurrent: 1,
			minTime: 33 // 30 per second => 1 req per 33 ms.
		})
	}

	// When adding to the queue use this method, takes in a promise. Read the documentation of 'bottleneck' if you want to use async/await or callbacks instead.
	add(promise) {
		return this.limiter.schedule(promise)
	}
}

export const FinnhubQueue = new Queue()
