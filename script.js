const btn = document.getElementById('btn')
const btn2 = document.getElementById('btn2')

async function loadDb() {
	const response = await fetch('data.db')
	const buffer = await response.arrayBuffer()
	db = new SQL.Database(new Uint8Array(buffer)) // global var db
}

async function fetchData() {
	// variables
	const tb = document.getElementById('tb')
	const table1 = document.getElementById('table1')
	const table2 = document.getElementById('table2')
	const rank = document.getElementById('rank').value
	const category = document.getElementById('category').value
	// const state = document.getElementById('state').value
	const gender = neutral.checked ? 'Neutral' : 'Female'

	let branch = ''
	for (const i of document.getElementById('branch').selectedOptions) {
		branch += `'${i.value}', `
	}
	branch = branch.slice(0, -2)

	// const college = []
	// for (const i of document.getElementsByName('college')) {
	// 	if (i.checked) {
	// 		college.push(i.value)
	// 	}
	// }

	// sql query
	const query = `select * from data
	where seat = '${category}' and
	gender = '${gender}' and
    closing > ${rank} and
	branch in (${branch})
    order by closing
	limit 50`

	// fetched data in 2D array
	const result = db.exec(query)[0].values

	// show table
	tb.classList.remove('d-none')

	// clear table
	table1.innerHTML = ''

	// iterating through result and inserting cells to table1, table2

	for (let i = 0; i < 10; i++) {
		let row = table1.insertRow(i)
		for (let j = 0; j < 7; j++) {
			row.insertCell(j).innerHTML = result[i][j]
		}
	}
	for (let i = 10; i < result.length; i++) {
		let row = table2.insertRow(i - 10)
		for (let j = 0; j < 7; j++) {
			row.insertCell(j).innerHTML = result[i][j]
		}
	}
}

function expand() {
	if (btn2.innerHTML == 'Expand') {
		btn2.innerHTML = 'Collapse'
	} else {
		btn2.innerHTML = 'Expand'
	}
}

btn.addEventListener('click', fetchData)
btn2.addEventListener('click', expand)
document.addEventListener('DOMContentLoaded', loadDb)
