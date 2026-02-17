// zustand like global store

let state = {
	lastFilters: {},
	queryResult: {},
	db: {},
}

export const store = {
	// getters
	get lastFilters() {
		return state.lastFilters
	},
	get queryResult() {
		return state.queryResult
	},
	get db() {
		return state.db
	},

	// setters
	set lastFilters(value) {
		state.lastFilters = value
	},
	set queryResult(value) {
		state.queryResult = value
	},
	set db(value) {
		state.db = value
	},
}
