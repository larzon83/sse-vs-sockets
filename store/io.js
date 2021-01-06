export const state = () => ({
	currentState: 'DISCONNECTED'
})

export const mutations = {
	SET_STATE(state, val) {
		state.currentState = val
	}
}
