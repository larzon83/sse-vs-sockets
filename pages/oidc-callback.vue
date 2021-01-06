<template>
	<div />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'OidcCallback',

	computed: {
		...mapGetters('oidc', [
			'oidcIsAuthenticated',
			'oidcAuthenticationIsChecked',
			'oidcError'
		])
	},

	created() {
		if (process.client) {
			this.oidcSignInCallback()
				.then(redirectPath => {
					sessionStorage.removeItem('no_state_authentication_retried')
					this.$router.push(redirectPath)
				})
				.catch(err => {
					/* Handle Browser Back-Button
					 * If user clicks the Browser Back-Button right after successful login, that last page would be "/oidc-callback".
					 * The result would be a "no state found in storage" error.
					 * This catch block would be called then and the user would be redirected to "/oidc-callback-error".
					 * To prevent this, we check if the user is authenticated & redirect him to the page where the login-flow started.
					 */
					if (this.oidcIsAuthenticated) {
						this.$router.push(
							sessionStorage.getItem('vuex_oidc_active_route') || '/'
						)
					} else {
						/* Handle error "No matching state found in storage"
						 * Users could end up on the oidc-callback-error page, even after entering the correct credentials in the login-form.
						 * Reasons are:
						 * 1.) user bookmarks login-page -> "state" in the saved url gets invalid after a period of time.
						 * 2.) some browsers (eg Firefox) treat this as a tracking and block access to localStorage -> comparing states fails
						 */

						// Check, if authentication-flow was already retried to prevent loops
						const noStateAuthenticationRetried =
							sessionStorage.getItem('no_state_authentication_retried') &&
							sessionStorage.getItem('no_state_authentication_retried') ===
								'yes'

						if (
							this.oidcAuthenticationIsChecked &&
							this.oidcError &&
							this.oidcError === 'No matching state found in storage' &&
							!noStateAuthenticationRetried
						) {
							// Try to re-authenticate
							sessionStorage.setItem('no_state_authentication_retried', 'yes')
							this.authenticateOidc({
								redirectPath:
									sessionStorage.getItem('vuex_oidc_active_route') || '/'
							})
						} else {
							console.error(err)
							if (this.$route.query.error === 'access_denied')
								this.$router.push('/')
							else {
								this.$router.push('/oidc-callback-error')
							}
						}
					}
				})
		}
	},
	methods: {
		...mapActions('oidc', ['oidcSignInCallback', 'authenticateOidc'])
	}
}
</script>
