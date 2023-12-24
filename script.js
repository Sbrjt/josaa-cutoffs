const button = document.getElementById('button')
const table = document.getElementById('table')

async function loadDb() {
	const response = await fetch('data.db')
	const buffer = await response.arrayBuffer()
	db = new SQL.Database(new Uint8Array(buffer)) // global var db
}

async function showTable() {
	// variables
	const rank = document.getElementById('rank').value
	const category = document.getElementById('category').value
	const state = document.getElementById('state').value
	const gender = neutral.checked ? 'Neutral' : 'Female'

	let branch = ''
	for (const i of document.getElementById('branch').selectedOptions) {
		branch += `'${i.value}', `
	}
	branch = branch.slice(0, -2)
	console.log(branch)

	// const selectedOptions = document.querySelectorAll(
	// 	'#multipleSelect option:checked'
	// )
	// const selectedValues = Array.from(selectedOptions).map(
	// 	(option) => option.value
	// )
	// let branch = ''
	// for (const i of document.getElementsByName('branch')) {
	// 	if (i.checked) {
	// 		branch += `'${i.value}',`
	// 	}
	// }
	const college = []
	for (const i of document.getElementsByName('college')) {
		if (i.checked) {
			college.push(i.value)
		}
	}

	// sql query
	const query = `select * from data
	where seat = '${category}' and
	gender = '${gender}' and
    closing > ${rank} and
	branch in (${branch})
    order by closing
    limit 10`

	// fetched data in 2D array
	const result = db.exec(query)[0].values

	// clear table
	table.innerHTML = ''

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
