(async () => {
	// Fetching and initializing the database
	const response = await fetch('assets/data.db')
	const buffer = await response.arrayBuffer()
	const db = new SQL.Database(new Uint8Array(buffer))

	// variables initialization:
	let row // current row no
	let result // fetched result from database
	let rowCount // total number of records in result set
	const table = $('#table') // not working with getElementById 🤷‍♂️
	const btn = document.getElementById('btn') // GO btn
	const btn2 = document.getElementById('btn2') // 'Show more' btn
	const btn3 = document.getElementById('btn3') // 'Show more' btn

	if (btn.disabled === true) {
		btn.disabled = false
		document.getElementById('go').classList.remove('d-none')
		document.getElementById('spinner').classList.add('d-none')
	}
	btn.addEventListener('click', fetchData) // fetch data and insert the first 10 records into table

	function fetchData() {
		table.bootstrapTable('removeAll') // clear table contents

		// get user inputs from form and prepare sql query:

		let rank = document.getElementById('rank').value
		// validating rank input with regex (only digits allowed)
		if (!/^\d+$/.test(rank)) {
			return
		}

		const category = document.getElementById('category').value

		// Getting selected values from 'branch' and join them (with commas and quotes) to prepare SQL query
		const branch = Array.from(document.getElementById('branch').selectedOptions)
			.map(i => `'${i.value}'`)
			.join(', ')

		const state = document.getElementById('state').value

		const gender = document.getElementsByName('gender')[0].checked
			? 'Neutral'
			: 'Female'

		// get elements with name 'type', convert to array, filter to get only the checked ones,
		// map them to an array of their values wrapped in single quotes,
		// join the array into a comma-separated string to prepare SQL query
		const type = Array.from(document.getElementsByName('type'))
			.filter(i => i.checked)
			.map(i => `'${i.value}'`)
			.join(', ')

		// sql query
		const query = `
		select  Institute, State, Branch, Quota, Seat, Gender, Open, Close from tb
		where Seat = '${category}' and
		Gender = '${gender}' and
		Close >= ${rank} and
		Branch in (${branch}) and
		(
			(Quota in ('HS', 'GO', 'LA', 'JK') and State = '${state}')
			or (Quota = 'OS' and State != '${state}')
			or Quota = 'AI' or
			'${state}' = 'Select an option'
		) and
		Institute_type in (${type})
		order by Close
		`

		// execute query
		l = db.exec(query)

		if (l.length === 0) {
			return
		}

		// storing data in a 2D array
		result = l[0].values
		rowCount = result.length

		row = 0
		insertRows() // Insert initial 10 records into table

		// show table (as it is hidden initially)
		const tableDiv = document.getElementById('tableDiv')
		if (tableDiv.classList.contains('d-none')) {
			tableDiv.classList.remove('d-none')
		}

		btn2.addEventListener('click', insertRows) // insert 10 more records
		btn3.addEventListener('click', insertAllRows) // insert all records

		function insertRows() {
			// insert 10 records into table
			for (let i = 0; i < 10 && row < rowCount; i++) {
				table.bootstrapTable('append', {
					institute: result[row][0],
					state: result[row][1],
					branch: result[row][2],
					quota: result[row][3],
					seat: result[row][4],
					gender: result[row][5],
					open: result[row][6],
					close: result[row][7],
				})
				row++
			}
		}

		function insertAllRows() {
			// insert 10 records into table
			while (row < rowCount) {
				table.bootstrapTable('append', {
					institute: result[row][0],
					state: result[row][1],
					branch: result[row][2],
					quota: result[row][3],
					seat: result[row][4],
					gender: result[row][5],
					open: result[row][6],
					close: result[row][7],
				})
				row++
			}
		}
	}
})()

document.addEventListener('DOMContentLoaded', () => {
	// in mobile view hide unnecessary columns
	const l = ['quota', 'state', 'seat', 'gender', 'open']

	if (window.matchMedia('(max-width: 576px)').matches) {
		for (let i of l) {
			document
				.querySelector(`th[data-field="${i}"]`)
				.setAttribute('data-visible', 'false')
		}
	}
})
