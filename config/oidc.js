const appUrl = 'http://localhost:3000'

export const oidcSettings = {
	authority: 'http://localhost:8080/auth/realms/oxygen_sse',
	clientId: 'app_sse',
	redirectUri: `${appUrl}/oidc-callback/`,
	responseType: 'code',
	scope: 'openid email',
	automaticSilentRenew: true,
	monitorSession: false,
	loadUserInfo: false,
	silentRedirectUri: `${appUrl}/silent-renew-oidc.html`,
	post_logout_redirect_uri: `${appUrl}/`
}
