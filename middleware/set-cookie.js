// NOTE: for SSE -> probably insecure...
export default function ({ isServer, res, store }) {
	const exdays = 10
	const d = new Date()
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
	const expires = 'expires=' + d.toUTCString()

	if (isServer) {
		res.setHeader('Set Cookie', [`lang=de`])
	} else {
		const user = store.getters['oidc/oidcUser']?.preferred_username ?? ''
		const userSub = store.getters['oidc/oidcUser']?.sub ?? ''
		const userSessionState = store.getters['oidc/oidcUser']?.session_state ?? ''
		document.cookie = 'user=' + user + ';' + expires + ';path=/;SameSite=Strict'
		document.cookie =
			'userSub=' + userSub + ';' + expires + ';path=/;SameSite=Strict'
		document.cookie =
			'userSessionState=' +
			userSessionState +
			';' +
			expires +
			';path=/;SameSite=Strict'
	}
}
