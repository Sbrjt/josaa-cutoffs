const btn = document.getElementById('btn') // GO btn
const btn2 = document.getElementById('btn2') // 'Show more' btn
let i // current row no
let db //  local database for loadDb function
let result // fetched result from tb
const tableDiv = document.getElementById('tableDiv')

async function loadDb() {
	const response = await fetch('data.db')
	const buffer = await response.arrayBuffer()
	db = new SQL.Database(new Uint8Array(buffer)) // global var db
}

function fetchData() {
	// get user inputs from form and prepare sql query

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

	// get elements with name 'type', convert them to array, filter to get only the checked ones,
	// map them to an array of their values wrapped in single quotes,
	// join the array into a comma-separated string to prepare SQL query
	const type = Array.from(document.getElementsByName('type'))
		.filter(i => i.checked)
		.map(i => `'${i.value}'`)
		.join(', ')

	// show table (as it is hidden initially)
	if (tableDiv.classList.contains('d-none')) {
		tableDiv.classList.remove('d-none')
	}

	table = $('#table')
	// clear table contents
	table.bootstrapTable('removeAll')

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

	// execute query and fetch data in a 2D array
	result = db.exec(query)[0].values
	n = result.length

	i = 0

	// iterating through result and inserting 10 rows into table (7 cols)
	while (i < 10) {
		table.bootstrapTable('append', {
			institute: result[i][0],
			state: result[i][1],
			branch: result[i][2],
			quota: result[i][3],
			seat: result[i][4],
			gender: result[i][5],
			open: result[i][6],
			close: result[i][7],
		})
		i++
	}
}

function expand() {
	// insert 10 more records into table
	for (let j = 0; j < 10 && i < n; j++) {
		table.bootstrapTable('append', {
			institute: result[i][0],
			state: result[i][1],
			branch: result[i][2],
			quota: result[i][3],
			seat: result[i][4],
			gender: result[i][5],
			open: result[i][6],
			close: result[i][7],
		})
		i++
	}
}

function setColumnVisibility() {
	// in mobile view hide unnecessary columns
	const l = ['quota', 'state', 'seat', 'gender', 'open']

	if (window.matchMedia('(max-width: 576px)').matches) {
		for (let i of l) {
			document
				.querySelector(`th[data-field="${i}"]`)
				.setAttribute('data-visible', 'false')
		}
	}
}

setColumnVisibility()
btn.addEventListener('click', fetchData)
btn2.addEventListener('click', expand)
document.addEventListener('DOMContentLoaded', loadDb)
