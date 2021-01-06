<template>
	<div>
		<BaseInfo title="socket">
			<!-- <div>
				<button @click.prevent="getMessage()">CLICK</button>
			</div> -->
			<p v-for="(message, index) in messages" :key="index">
				{{ message }}
			</p>
		</BaseInfo>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'Io',

	data() {
		return {
			messages: [],
			messageRxd: '',
			socketStatus: {}
		}
	},

	computed: {
		...mapGetters('oidc', ['oidcAccessToken', 'oidcUser'])
	},

	mounted() {
		this.socket = this.$nuxtSocket({
			withCredentials: true,
			// channel: '/',
			// transports: ['websocket'],
			name: 'emob',
			path: '/emobstate',
			transportOptions: {
				polling: {
					extraHeaders: {
						// <-- extraHeaders gets nested under transportOptions.polling
						Authorization: `Bearer ${this.oidcAccessToken}`,
						user: this.oidcUser.preferred_username
					}
				}
			}
		})

		this.socket.on('state', (msg, cb) => {
			console.log('msg:', msg)
			this.messages.push(msg)
		})

		this.socket.on('error', reason => {
			console.log('Error. Reason:', reason)
		})

		// example for sending events to server
		// this.socket.emit('getMessage', 'abc123', resp => {
		// 	console.log('resp:', resp)
		// 	this.messageRxd = resp
		// })
	},

	methods: {
		// getMessage() {
		// 	this.socket.emit('getMessage', 'abc123', resp => {
		// 		console.log('resp:', resp)
		// 		this.messageRxd = resp
		// 	})
		// }
	}
}
</script>
