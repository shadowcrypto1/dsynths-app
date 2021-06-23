import React, { useEffect, useContext } from 'react'
import styled from 'styled-components'
import { ThemeContext } from '../../context/ThemeContext'

const Widget = tryRequire()
	? tryRequire()
	: null

function tryRequire () {
	try {
		const lib = require('../../static/charting_library/charting_library')
		return lib.widget
	} catch (err) {
		console.log(err)
		return null
	}
}

const Container = styled.div.attrs(props => ({
	className: props.className,
	id: props.id,
}))`
  height: 100%;
`

export const TVChartContainer = ({ widgetOptions }) => {
	const { theme } = useContext(ThemeContext)

	useEffect(() => {
		if (Widget) {
			let tvWidget = new Widget(widgetOptions)
			tvWidget.onChartReady(() => {
				// TODO: add buttons in the header to change timeframe (we do not favor the inherent dropdown)
			})

			return () => {
				if (tvWidget !== null) {
					tvWidget.remove()
					tvWidget = null
				}
			}
		} else {
			console.error('The TradingView charting_library seems to be missing, please read the README.md for further information.')
		}
	}, [theme])

	return (
		<Container
			className="TVChartContainer"
			id={widgetOptions.container_id}
		/>
	)
}
