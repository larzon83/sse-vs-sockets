<template>
	<div>
		<BaseInfo title="socket">
			<!-- <div>
				<button @click.prevent="getMessage()">CLICK</button>
			</div> -->
			<div><i>VUEX state:</i> {{ currentState }}</div>
			<br />
			<p v-for="(state, index) in statesLog" :key="index">
				{{ state }}
			</p>
		</BaseInfo>
	</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
	name: 'Io',

	data() {
		return {
			// messageRxd: '',
			statesLog: [],
			socketStatus: {}
		}
	},

	computed: {
		...mapGetters('oidc', ['oidcAccessToken', 'oidcUser']),
		...mapState('io', ['currentState'])
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

		this.socket.on('state', (newState, cb) => {
			this.statesLog.push(newState)
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
