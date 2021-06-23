import React, { createContext, useEffect, useState } from 'react'

const themeMapping = ['light', 'dark']

export const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
	const localSt = localStorage.getItem('theme')
	const [theme, setTheme] = useState(localSt ? localSt : null)

	useEffect(() => {
		const $html = document.querySelector('html')
		$html.classList.remove('light')
		$html.classList.remove('dark')
		$html.classList.add(theme)
	}, [theme])

	return (
		<ThemeContext.Provider value={{ theme: themeMapping.includes(theme) ? theme : 'light', setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}
