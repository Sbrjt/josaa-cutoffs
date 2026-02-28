/* global Sentry */
import { store } from './data-store.js'

class TableController {
	#table
	#tableDiv
	#rowNum = 0

	constructor(table, tableDiv) {
		this.#table = table
		this.#tableDiv = tableDiv

		if (!$.fn.bootstrapTable)
			Sentry.captureMessage('Bootstrap Table not loaded', 'error')
	}

	// TODO: add multiple rows in one go
	#appendRow(rowData) {
		this.#table.bootstrapTable('append', {
			institute: rowData[0],
			state: rowData[1],
			branch: rowData[2],
			quota: rowData[3],
			seat: rowData[4],
			gender: rowData[5],
			open: rowData[6],
			close: rowData[7],
		})
	}

	show() {
		if (this.#tableDiv.classList.contains('d-none')) {
			this.#tableDiv.classList.remove('d-none')
		}
	}

	clear() {
		this.#table.bootstrapTable('removeAll')
		store.queryResult = []
		this.#rowNum = 0
	}

	appendNext(count = 10) {
		const limit = Math.min(count, store.queryResult.length - this.#rowNum)

		for (let i = 0; i < limit; i++) {
			this.#appendRow(store.queryResult[this.#rowNum++])
		}
	}

	appendAll(delayMs = 200) {
		const remaining = store.queryResult.length - this.#rowNum

		for (let i = 0; i < remaining; i++) {
			// Timeout prevents blocking the main thread when appending many rows
			// Keeps the UI responsive so users can still interact with the site
			setTimeout(() => {
				this.#appendRow(store.queryResult[this.#rowNum++])
			}, delayMs * i)
		}
	}

	export() {
		this.#table.bootstrapTable('exportTable', { type: 'csv' })
	}
}

export function initTable() {
	const table = $('#table') // not working with getElementById 🤷‍♂️
	const tableDiv = document.getElementById('table-div')
	const exportBtn = document.getElementById('export-btn')

	const tableController = new TableController(table, tableDiv)
	const showMoreBtn = document.getElementById('show-more-btn')
	const showAllBtn = document.getElementById('show-all-btn')

	showMoreBtn.addEventListener('click', () => tableController.appendNext())
	showAllBtn.addEventListener('click', () => tableController.appendAll())
	exportBtn.addEventListener('click', () => tableController.export())

	return tableController
}
