const btn = document.getElementById('btn') // GO btn
const btn2 = document.getElementById('btn2') // 'Show more' btn
let x // row no
let db // database for loadDb
let result

async function loadDb() {
	const response = await fetch('data.db')
	const buffer = await response.arrayBuffer()
	db = new SQL.Database(new Uint8Array(buffer)) // global var db
}

function fetchData() {
	// variables:

	let rank = document.getElementById('rank').value
	if (rank === '') {
		rank = 1 // default value
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

	const tb = document.getElementById('tb') //parent table
	const table = document.getElementById('table') //table body

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

	// fetched data in 2D array
	result = db.exec(query)[0].values

	x = 0
	// iterating through result and inserting 10 rows into table (x - row, y - col)
	for (let i = 0; i < 10 && x < result.length; i++) {
		let row = table.insertRow()
		for (let y = 0; y < 7; y++) {
			row.insertCell(y).innerHTML = result[x][y]
		}
		x++
	}
}

function expand() {
	// insert 10 more records
	for (let i = 0; i < 10 && x < result.length; i++) {
		let row = table.insertRow()
		for (let y = 0; y < 7; y++) {
			row.insertCell(y).innerHTML = result[x][y]
		}
		x++
	}
}

btn.addEventListener('click', fetchData)
btn2.addEventListener('click', expand)
document.addEventListener('DOMContentLoaded', loadDb)
