;(async () => {
	// initializing the database
	// This takes time, so the script tag is put in head
	const response = await fetch('data.db')
	const buffer = await response.arrayBuffer()
	const db = new SQL.Database(new Uint8Array(buffer))
	db.prepare('select * from tb') // improves performance by reducing the overhead

	const btn1 = document.getElementById('btn-1')
	const btn2 = document.getElementById('btn-2') // 'Show more' btn
	const btn3 = document.getElementById('btn-3') // 'Show all' btn
	const table = $('#table') // not working with getElementById 🤷‍♂️
	const tableDiv = document.getElementById('tableDiv')

	if (btn1.disabled === true) {
		btn1.disabled = false
		document.getElementById('go').classList.remove('d-none')
		document.getElementById('spinner').classList.add('d-none')
	}

	let rank, category, branch, state, gender, type, result, rowCount, row

	// fetch data and insert the first 10 records into table on clicking btn
	btn1.addEventListener('click', () => {
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
		l = db.exec(query)

		if (l.length === 0) {
			result = []
			return
		}

		// storing data in a 2D array
		result = l[0].values

		rowCount = result.length // total number of records in result set

		row = 0 // current row no
		insertRows() // Insert initial 10 records into table
	})

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

		document.getElementById('neu-radio').checked = document.getElementById('Neutral').checked
		document.getElementById('fem-radio').checked = document.getElementById('Female').checked

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
			document.querySelector(`th[data-field="${i}"]`).setAttribute('data-visible', 'false')
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
