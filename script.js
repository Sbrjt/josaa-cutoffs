;(async () => {
	const SQL = await initSqlJs({
		locateFile: (file) =>
			`https://cdn.jsdelivr.net/npm/sql.js/dist/sql-wasm.wasm`,
	})

	const response = await fetch('data.db.gz')
	const buffer = await response.arrayBuffer()
	const decompressedBuffer = await pako.inflate(buffer)
	const db = new SQL.Database(new Uint8Array(decompressedBuffer))
	db.prepare('select * from tb') // improves performance by reducing the overhead

	const goBtn = document.getElementById('btn-1')
	const showMoreBtn = document.getElementById('btn-2')
	const showAllBtn = document.getElementById('btn-3')
	const table = $('#table') // not working with getElementById 🤷‍♂️
	const tableDiv = document.getElementById('table-div')

	if (goBtn.disabled === true) {
		goBtn.disabled = false
		document.getElementById('go').classList.remove('d-none')
		document.getElementById('spinner').classList.add('d-none')
	}

	let rank, category, branch, state, gender, type, result, rowCount, row

	// fetch data and insert the first 10 records into table on clicking btn
	goBtn.addEventListener('click', async () => {
		// show table (as it is hidden initially)
		if (tableDiv.classList.contains('d-none')) {
			tableDiv.classList.remove('d-none')
		}

		table.bootstrapTable('removeAll') // clear table contents

		// get user inputs from form and prepare sql query:

		rank = document.getElementById('rank').value
		// validating rank input with regex (only digits allowed)
		if (!/^\d+$/.test(rank)) {
			result = []
			return
		}

		category = document.getElementById('category').value

		// Getting selected values from 'branch' and join them (with commas and quotes) to prepare SQL query
		branch = Array.from(document.getElementById('branch').selectedOptions)
			.map((i) => `'${i.value}'`)
			.join(', ')

		state = document.getElementById('state').value

		gender = Array.from(document.getElementsByName('gender'))
			.filter((i) => i.checked)
			.map((i) => `'${i.value}'`)
			.join(', ')

		// get elements with name 'type', convert to array, filter to get only the checked ones,
		// map them to an array of their values wrapped in single quotes,
		// join the array into a comma-separated string to prepare SQL query
		type = Array.from(document.getElementsByName('type'))
			.filter((i) => i.checked)
			.map((i) => `'${i.value}'`)
			.join(', ')

		// sql query
		const query = `
		select  Institute, State, Branch, Quota, Seat, Gender, Open, Close from tb
		where Seat = '${category}' and
		Gender in (${gender}) and
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
		const queryResult = await db.exec(query)

		if (queryResult.length === 0) {
			result = []
			return
		}

		// storing data in a 2D array
		result = queryResult[0].values

		rowCount = result.length // total number of records in result set

		row = 0 // current row no
		insertRows() // Insert initial 10 records into table
	})

	showMoreBtn.addEventListener('click', insertRows) // insert 10 more records
	showAllBtn.addEventListener('click', insertAllRows) // insert all records

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
		// insert all records into table
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

	// save values to local storage
	window.addEventListener('beforeunload', () => {
		if (rowCount !== undefined && rowCount !== 0) {
			localStorage.setItem('rank', rank)
			localStorage.setItem('category', category)
			// localStorage.setItem('branch', branch)
			localStorage.setItem('state', state)
			localStorage.setItem('gender', gender)
			localStorage.setItem('type', type)
		}
	})
})()

// load form inputs from local storage
;(function load_local() {
	if (localStorage.getItem('rank') !== null) {
		document.getElementById('rank').value = localStorage.getItem('rank')
		document.getElementById('category').value = localStorage.getItem('category')
		document.getElementById('state').value = localStorage.getItem('state')

		const g = localStorage.getItem('gender').slice(1, -1).split("', '")

		for (let i of Array.from(document.getElementsByName('gender'))) {
			i.checked = g.includes(i.id)
		}

		document.getElementById('neu-radio').checked =
			document.getElementById('Neutral').checked
		document.getElementById('fem-radio').checked =
			document.getElementById('Female').checked

		const type = localStorage.getItem('type').slice(1, -1).split("', '")
		for (let i of Array.from(document.getElementsByName('type'))) {
			i.checked = type.includes(i.id)
		}

		// const branches = localStorage.getItem('branch').slice(1, -1).split("', '")

		// const selectElement = document.getElementById('branch')

		// for (let option of selectElement.options) {
		// 	option.selected = branches.includes(option.value)
		// }
	}
})()

// in mobile view hide unnecessary columns
;(function hide_cols_in_mobile() {
	const l = ['quota', 'state', 'seat', 'gender', 'open']

	if (window.matchMedia('(max-width: 576px)').matches) {
		for (let i of l) {
			document
				.querySelector(`th[data-field="${i}"]`)
				.setAttribute('data-visible', 'false')
		}
	}
})()

// iit and (nit, iiit, gfti) form separate groups
;(function check_type() {
	const iit = document.getElementById('iit')
	const nit = document.getElementById('nit')
	const iiit = document.getElementById('iiit')
	const gfti = document.getElementById('gfti')

	const l = [nit, iiit, gfti]

	iit.addEventListener('change', () => {
		if (iit.checked) {
			for (let i of l) {
				i.checked = false
			}
		}
	})

	for (let i of l) {
		i.addEventListener('change', () => {
			if (i.checked) {
				iit.checked = false
			}
		})
	}
})()

// make sure atleast one radio is checked
;(function check_gender() {
	const neu_check = document.getElementById('Neutral')
	const fem_check = document.getElementById('Female')
	const neu_radio = document.getElementById('neu-radio')
	const fem_radio = document.getElementById('fem-radio')

	neu_check.addEventListener('change', () => {
		if (!fem_check.checked) {
			neu_check.checked = true
		}
		neu_radio.checked = neu_check.checked
	})

	neu_radio.addEventListener('change', () => {
		neu_check.checked = neu_radio.checked
	})

	fem_check.addEventListener('change', () => {
		if (!neu_check.checked) {
			fem_check.checked = true
		}
		fem_radio.checked = fem_check.checked
	})

	fem_radio.addEventListener('change', () => {
		fem_check.checked = fem_radio.checked
	})
})()

// calculate rank
;(function find_rank() {
	const btn = document.getElementById('btn-4')
	const percentile_inp = document.getElementById('percentile')

	percentile_inp.addEventListener('focusout', () => {
		const rank_inp = document.getElementById('rank')
		const percentile = Number(percentile_inp.value)

		if (isNaN(percentile) || percentile <= 0 || percentile > 100) {
			percentile_inp.value = ''
			return
		}

		const rank = Math.round((100 - percentile) * 17000) // assuming 17 lakh students
		rank_inp.value = rank
	})
})()

// enable tooltip
;(function tooltip() {
	const tooltipTriggerList = document.querySelectorAll(
		'[data-bs-toggle="tooltip"]'
	)
	const tooltipList = [...tooltipTriggerList].map(
		(tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
	)
})()
