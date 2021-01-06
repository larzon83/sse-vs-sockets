<template>
	<div class="container">
		<div class="content">
			<Logo />
			<h1 class="title">{{ title }}</h1>
			<h3>{{ greeting }}</h3>
			<div class="links">
				<a href="#" class="button--grey" @click.prevent="signOutOidc">
					Logout
				</a>
			</div>
			<div style="margin-top: 50px">
				<h3 style="padding-bottom: 7px">States-Log</h3>
				<slot />
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'BaseInfo',

	props: {
		title: {
			type: String,
			default: ''
		}
	},

	computed: {
		...mapGetters('oidc', ['oidcIsAuthenticated', 'oidcUser']),

		greeting() {
			let greeting = 'Hallo'

			if (this.oidcIsAuthenticated)
				if (this.oidcUser.given_name && this.oidcUser.given_name !== '')
					greeting += ` ${this.oidcUser.given_name}`
				else greeting += ` ${this.oidcUser.preferred_username}`

			return greeting
		}
	},

	methods: {
		...mapActions('oidc', ['signOutOidc'])
	}
}
</script>

<style>
.container {
	margin: 0 auto;
	min-height: calc(100vh - 50px);
	display: flex;
	justify-content: center;
	align-items: flex-start;
	text-align: center;
}

.content {
	margin-top: 60px;
}

.title {
	font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
		'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	display: block;
	font-weight: 300;
	font-size: 100px;
	color: #35495e;
	letter-spacing: 1px;
	margin-top: 15px;
	margin-bottom: 10px;
}

.subtitle {
	font-weight: 300;
	font-size: 42px;
	color: #526488;
	word-spacing: 5px;
	padding-bottom: 15px;
}

.links {
	padding-top: 15px;
}
</style>
