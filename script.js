const btn = document.getElementById('btn') // GO btn
const btn2 = document.getElementById('btn2') // 'Show more' btn
let currentRow // current row no
let db //  local database for loadDb function
let result // fetched result from tb
const table = document.getElementById('table') //table body
const tb = document.getElementById('tb') //parent table

async function loadDb() {
	const response = await fetch('data.db')
	const buffer = await response.arrayBuffer()
	db = new SQL.Database(new Uint8Array(buffer)) // global var db
}

function fetchData() {
	// get user inputs from form and prepare sql query

	let rank = document.getElementById('rank').value
	if (!/^\d+$/.test(rank)) {
		// validate rank input (only digits allowed)
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
	if (tb.classList.contains('d-none')) {
		tb.classList.remove('d-none')
	}

	// clear table contents
	table.innerHTML = ''

	// sql query
	const query = `
	select  Institute, Branch, Quota, Seat_type, Gender, Opening_rank, Closing_rank from tb
	where Seat_type = '${category}' and
	Gender = '${gender}' and
    Closing_rank >= ${rank} and
	Branch in (${branch}) and
	(
        (Quota in ('HS', 'GO', 'LA', 'JK') and State = '${state}')
        or (Quota = 'OS' and State != '${state}')
        or Quota = 'AI' or
		'${state}' = 'Select an option'
    ) and
	Institute_type in (${type})
    order by Closing_rank
	`

	// execute query and fetch data in a 2D array
	result = db.exec(query)[0].values

	currentRow = 0
	// iterating through result and inserting 10 rows into table (7 cols)
	for (let i = 0; i < 10 && currentRow < result.length; i++) {
		let row = table.insertRow()
		for (let j = 0; j < 7; j++) {
			row.insertCell(j).innerHTML = result[currentRow][j]
		}
		currentRow++
	}
}

function expand() {
	// insert 10 more records into table
	for (let i = 0; i < 10 && currentRow < result.length; i++) {
		let row = table.insertRow()
		for (let j = 0; j < 7; j++) {
			row.insertCell(j).innerHTML = result[currentRow][j]
		}
		currentRow++
	}
}

btn.addEventListener('click', fetchData)
btn2.addEventListener('click', expand)
document.addEventListener('DOMContentLoaded', loadDb)
