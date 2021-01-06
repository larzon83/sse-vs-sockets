const proxyOptions = {
	'/sse/': {
		target: 'http://localhost:4000',
		pathRewrite: { '^/sse/': '' }
	}
}

export default {
	// Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
	ssr: false,

	// Target (https://go.nuxtjs.dev/config-target)
	target: 'server',

	// Global page headers (https://go.nuxtjs.dev/config-head)
	head: {
		title: 'SSE vs. Sockets',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' }
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
	},

	// Global CSS (https://go.nuxtjs.dev/config-css)
	css: [],

	// Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
	plugins: [{ src: '~/plugins/sse.client.js', mode: 'client' }],

	// Auto import components (https://go.nuxtjs.dev/config-components)
	components: true,

	// Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
	buildModules: [
		// https://go.nuxtjs.dev/eslint
		'@nuxtjs/eslint-module'
	],

	// Modules (https://go.nuxtjs.dev/config-modules)
	modules: [
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
		'nuxt-socket-io'
	],

	// Axios module configuration (https://go.nuxtjs.dev/config-axios)
	axios: { proxy: true },

	/*
	 ** Proxy module configuration
	 */
	proxy: proxyOptions,

	io: {
		server: false, // https://nuxt-socket-io.netlify.app/configuration#io-server-overrides
		sockets: [
			{
				name: 'emob',
				url: 'http://localhost:5000',
				default: true,
				vuex: {
					mutations: [
						{
							// When "state" is received,
							// commit mutation "io/SET_STATE
							state: 'io/SET_STATE'
						}
					]
				},
				namespaces: {}
			}
		]
	},

	router: {
		base: '/',
		middleware: ['vuex-oidc-router', 'set-cookie']
	},

	// Build Configuration (https://go.nuxtjs.dev/config-build)
	build: {}
}
