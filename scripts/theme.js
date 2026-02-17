import { getLocal, setLocal } from './local-storage.js'

function toggleTheme() {
	let theme =
		getLocal('theme') ||
		(window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light')

	if (theme === 'dark') {
		document.documentElement.removeAttribute('data-bs-theme')
		theme = 'light'
	} else {
		document.documentElement.setAttribute('data-bs-theme', 'dark')
		theme = 'dark'
	}

	setLocal('theme', theme)
	window.DISQUS.reset({ reload: true })
}

export async function initTheme() {
	const themeToggleBtn = document.getElementById('theme-btn')
	themeToggleBtn.addEventListener('click', toggleTheme)
}
