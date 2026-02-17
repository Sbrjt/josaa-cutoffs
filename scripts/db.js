/* global initSqlJs, pako */

import { store } from './data-store.js'

export async function initDatabase() {
	try {
		const SQL = await initSqlJs({
			locateFile: () =>
				'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.wasm',
		})

		const response = await fetch('cutoffs.db.gz')
		const buffer = await response.arrayBuffer()
		const decompressedBuffer = pako.inflate(buffer)
		const db = new SQL.Database(new Uint8Array(decompressedBuffer))
		db.prepare('select * from tb')

		store.db = db
	} catch (error) {
		// TODO: add a toast
		console.error('Failed to initialize database!')
		throw error
	}
}

function toSqlString(arr) {
	return arr.map((i) => `'${i}'`).join(', ')
}

function buildQuery(filters) {
	const { rank, category, branch, state, gender, type } = filters

	return `
		select Institute, State, Branch, Quota, Seat, Gender, Open, Close from tb
		where Seat = '${category}' and
		Gender in (${toSqlString(gender)}) and
		Close >= ${rank} and
		Branch in (${toSqlString(branch)}) and
		(
			(Quota in ('HS', 'GO', 'LA', 'JK') and State = '${state}')
			or (Quota = 'OS' and State != '${state}')
			or Quota = 'AI' or
			'${state}' = 'Select an option'
		) and
		Institute_type in (${toSqlString(type)})
		order by Close
	`
}

export function runQuery(db, filters) {
	const query = buildQuery(filters)
	const queryResult = db.exec(query)

	if (queryResult.length === 0) {
		return []
	}

	return queryResult[0].values
}
