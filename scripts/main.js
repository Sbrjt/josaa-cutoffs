import { initDatabase } from './db.js'
import { initDisqus } from './disqus.js'
import { initForm } from './form.js'
import { getStoredFilters, initLocalStore } from './local-storage.js'
import { initTable } from './table.js'
import { initTheme } from './theme.js'
import {
	hideColumnsOnMobile,
	initTooltips,
	setupGenderFilters,
	setupTypeFilters,
} from './ui.js'

async function initCore() {
	await initDatabase()
	const table = initTable()
	initForm(table)
}

async function main() {
	initCore()

	hideColumnsOnMobile()
	setupTypeFilters()
	setupGenderFilters()
	initTooltips()
	initTheme()
	initLocalStore()
	initDisqus()
	getStoredFilters()
}

main()

/* 
Earlier the functions in main() were synchronous.
If any function threw an error, 
execution stopped and the remaining functions never ran.

Now, the functions are async and intentionally NOT awaited.
Each one starts independently.
So if 1 fails, it doesn't prevent the others from running. 
*/
