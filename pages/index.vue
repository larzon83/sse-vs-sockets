<template>
	<div>
		<BaseInfo title="SSE">
			<p v-for="(message, index) in messages" :key="index">
				{{ message }}
			</p>
		</BaseInfo>
	</div>
</template>

<script>
// We store the reference to the SSE object out here
// so we can access it from other methods
let msgServer

export default {
	name: 'Index',

	data() {
		return {
			messages: []
		}
	},

	mounted() {
		;(async () => {
			try {
				// Store SSE object at a higher scope
				msgServer = await this.$sse('/sse/', {
					format: 'json',
					withCredentials: true
				})

				// Catch any errors (ie. lost connections, etc.)
				msgServer.onError(e => {
					console.error('lost connection; giving up!', e)

					// If you don't want SSE to automatically reconnect (if possible),
					// then uncomment the following line:
					// msgServer.close();
				})

				// Listen for messages without a specified event
				// msgServer.subscribe('', (data, rawEvent) => {
				// 	console.log('data:', rawEvent)
				// 	console.warn('Received a message w/o an event!', data)
				// })

				// Listen for messages based on their event (in this case, "chat")
				msgServer.subscribe('state', (message, rawEvent) => {
					this.messages.push(message)
				})

				// Unsubscribes from event-less messages after 7 seconds
				// setTimeout(() => {
				// 	msgServer.unsubscribe('')

				// 	console.log('Stopped listening to event-less messages!')
				// }, 7000)

				// Unsubscribes from chat messages after 7 seconds
				// setTimeout(() => {
				// 	msgServer.unsubscribe('add')

				// 	console.log('Stopped listening to chat messages')
				// }, 14000)
			} catch (err) {
				// When this error is caught, it means the initial connection to the
				// events server failed.  No automatic attempts to reconnect will be made.
				console.error('Failed to connect to server', err)
			}
		})()
	},

	beforeDestroy() {
		// Make sure to close the connection with the events server
		// when the component is destroyed, or we'll have ghost connections!
		if (msgServer) msgServer.close()
	}
}
</script>
