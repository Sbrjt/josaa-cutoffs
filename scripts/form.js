import { store } from './data-store.js'
import { runQuery } from './db.js'

function getCheckedValuesByName(name) {
	return Array.from(document.getElementsByName(name))
		.filter((item) => item.checked)
		.map((item) => item.value)
}

function getSelectedValuesById(id) {
	return Array.from(document.getElementById(id).selectedOptions).map(
		(item) => item.value,
	)
}

function getRank() {
	const rank = document.getElementById('rank').value

	// validating rank: only digits allowed
	if (!/^\d+$/.test(rank)) {
		return null
	}

	return rank
}

function getFilters() {
	return {
		rank: getRank(),
		category: document.getElementById('category').value,
		branch: getSelectedValuesById('branch'),
		state: document.getElementById('state').value,
		gender: getCheckedValuesByName('gender'),
		type: getCheckedValuesByName('type'),
	}
}

function showResults(table) {
	const filters = getFilters()

	if (filters.rank === null) {
		return
	}

	table.clear()
	table.show()

	const result = runQuery(store.db, filters)
	store.queryResult = result

	if (result.length === 0) {
		return
	}

	table.appendNext()
	store.lastFilters = filters
}

function findRank() {
	const percentileInput = document.getElementById('percentile')
	const rankInput = document.getElementById('rank')

	percentileInput.addEventListener('focusout', () => {
		const percentile = Number(percentileInput.value)

		if (isNaN(percentile) || percentile <= 0 || percentile > 100) {
			percentileInput.value = ''
			return
		}

		const rank = Math.round((100 - percentile) * 16000) // assuming 16 lakh students
		rankInput.value = rank
	})
}

export async function initForm(table) {
	const goBtn = document.getElementById('go-btn')
	const godiv = document.getElementById('go')

	// enable GO btn
	if (godiv.classList.contains('d-none')) {
		goBtn.disabled = false
		godiv.classList.remove('d-none')
		document.getElementById('spinner').classList.add('d-none')
	}

	goBtn.addEventListener('click', () => showResults(table))
	findRank()
}
