const button = document.getElementById('button')
const table = document.getElementById('table')

async function loadDb() {
	const response = await fetch('data.db')
	const buffer = await response.arrayBuffer()
	db = new SQL.Database(new Uint8Array(buffer))
}

async function showTable() {
	// clear table
	table.innerHTML = ''

	// variables
	const rank = document.getElementById('rank').value
	const branch = document.getElementById('branch').value
	const category = document.getElementById('category').value
	const state = document.getElementById('state').value
	const gender = neutral.checked ? 'Neutral' : 'Female'
	const college = []
	for (const i of document.getElementsByName('college')) {
		if (i.checked) {
			college.push(i.value)
		}
	}

	// sql query
	const query = `select * from data
	where gender = '${gender}' and
    closing > ${rank}
    order by closing
    limit 10`

	// fetched data in 2D array
	const result = db.exec(query)[0].values

	// iterating through result and inserting cells to table
	for (let i = 0; i < result.length; i++) {
		let row = table.insertRow(i)
		for (let j = 0; j < 7; j++) {
			row.insertCell(j).innerHTML = result[i][j]
		}
	}
}

button.addEventListener('click', showTable)
document.addEventListener('DOMContentLoaded', loadDb)
