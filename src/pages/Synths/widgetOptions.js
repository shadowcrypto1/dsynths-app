import { intervalMapping } from '../../utils/stocks'

export function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)')
	const results = regex.exec(window.location.search)
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

export const widgetOptions = ({
	theme = 'light',
	datafeed = null,
} = {}) => {
	if (!datafeed) throw new Error('Datafeed param is not provided')
	return {
		debug: false,
		symbol: 'dGME-L',
		interval: 'D',
		container_id: 'tv_chart_container',
		datafeed: datafeed,
		library_path: '/charting_library/',
		charts_storage_url: 'https://saveload.tradingview.com',
		charts_storage_api_version: '1.1',
		locale: getLanguageFromURL() || 'en',
		disabled_features: [
			'header_resolutions',
			'header_undo_redo',
			'header_settings',
			'header_saveload',
			'header_symbol_search',
			'symbol_search_hot_key',
			'header_compare',
			'timeframes_toolbar',
			'use_localstorage_for_settings',
		],
		theme: theme,
		supported_resolutions: Object.keys(intervalMapping),
		client_id: 'tradingview.com',
		user_id: 'public_user_id',
		fullscreen: false,
		autosize: true,
		studies_overrides: {},
		overrides: {
			'paneProperties.vertGridProperties.color': (theme === 'light') ? '#FFFFFF' : '#131722',
			'paneProperties.horzGridProperties.color': (theme === 'light') ? '#FFFFFF' : '#131722',
		},
	}
}
