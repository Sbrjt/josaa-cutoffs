/* global bootstrap */

export function hideColumnsOnMobile() {
	//  Hide lower-priority table columns in mobile view

	const columns = ['quota', 'state', 'seat', 'gender', 'open']

	if (window.matchMedia('(max-width: 576px)').matches) {
		for (const column of columns) {
			document
				.querySelector(`th[data-field="${column}"]`)
				.setAttribute('data-visible', 'false')
		}
	}
}

export async function initTooltips() {
	document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => {
		new bootstrap.Tooltip(el)
	})
}

export async function setupTypeFilters() {
	/*
     IIT is one group, while NIT, IIIT, GFTI form another
     selecting an option in one group automatically deselects options in the other
	*/

	const iit = document.getElementById('iit')
	const nit = document.getElementById('nit')
	const iiit = document.getElementById('iiit')
	const gfti = document.getElementById('gfti')

	const list = [nit, iiit, gfti]

	iit.addEventListener('change', () => {
		if (iit.checked) {
			for (const item of list) {
				item.checked = false
			}
		}
	})

	for (const item of list) {
		item.addEventListener('change', () => {
			if (item.checked) {
				iit.checked = false
			}
		})
	}
}

export async function setupGenderFilters() {
	/*
     Gender appears as a radio choice to the user, but under the hood is a checkbox
     because a female applicant may apply under both Neutral and Female categories.
     This keeps the radio UI and checkbox state in sync while ensuring
     at least one option remains selected.
    */

	const neuCheck = document.getElementById('Neutral')
	const femCheck = document.getElementById('Female')
	const neuRadio = document.getElementById('neu-radio')
	const femRadio = document.getElementById('fem-radio')

	neuCheck.addEventListener('change', () => {
		if (!femCheck.checked) {
			neuCheck.checked = true
		}
		neuRadio.checked = neuCheck.checked
	})

	neuRadio.addEventListener('change', () => {
		neuCheck.checked = neuRadio.checked
	})

	femCheck.addEventListener('change', () => {
		if (!neuCheck.checked) {
			femCheck.checked = true
		}
		femRadio.checked = femCheck.checked
	})

	femRadio.addEventListener('change', () => {
		femCheck.checked = femRadio.checked
	})
}
