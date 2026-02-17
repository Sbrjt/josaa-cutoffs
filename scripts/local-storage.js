import { store } from './data-store.js'

export function getLocal(key) {
	return JSON.parse(localStorage.getItem(key))
}

export function setLocal(key, value) {
	localStorage.setItem(key, JSON.stringify(value))
}

export async function getStoredFilters() {
	try {
		if (getLocal('rank') === null) {
			return
		}

		const rank = document.getElementById('rank')
		const category = document.getElementById('category')
		const state = document.getElementById('state')
		const neuCheck = document.getElementById('Neutral')
		const femCheck = document.getElementById('Female')
		const neuRadio = document.getElementById('neu-radio')
		const femRadio = document.getElementById('fem-radio')
		const genderInputs = document.getElementsByName('gender')
		const typeInputs = document.getElementsByName('type')

		rank.value = getLocal('rank')
		category.value = getLocal('category')
		state.value = getLocal('state')
		const genders = getLocal('gender')

		for (const item of genderInputs) {
			item.checked = genders.includes(item.id)
		}

		neuRadio.checked = neuCheck.checked
		femRadio.checked = femCheck.checked

		const types = getLocal('type')

		for (const item of typeInputs) {
			item.checked = types.includes(item.id)
		}
	} catch {
		// delete corrupted data from previous version
		localStorage.clear()
	}
}

function persistFilters() {
	if (store.lastFilters.rank && store.queryResult.length > 0) {
		for (const key in store.lastFilters) {
			setLocal(key, store.lastFilters[key])
		}
	}
}

export async function initLocalStore() {
	window.addEventListener('pagehide', persistFilters)
}
