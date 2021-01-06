const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const PORT = 4000
let connections = []
const states = {
	alec: 'DISCONNECTED',
	domi: 'DISCONNECTED'
}

const app = express()

// Set middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors())

app.get('/', (req, res, next) => {
	if (req.headers.accept && req.headers.accept === 'text/event-stream') {
		const user = req.cookies.user
		const userSub = req.cookies.userSub
		const userSessionState = req.cookies.userSessionState

		// Mandatory headers and http status to keep connection open
		const headers = {
			'Content-Type': 'text/event-stream',
			Connection: 'keep-alive',
			'Cache-Control': 'no-cache',
			// enabling CORS
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers':
				'Origin, X-Requested-With, Content-Type, Accept'
		}
		res.writeHead(200, headers)

		res.write('event: state' + '\n')

		// After user opens connection send state
		const data = `data: ${JSON.stringify(states[user])}\n\n`
		res.write(data)

		// Generate an id based on timestamp and save res
		// object of user-connection on connections-list
		// Later we'll iterate it and send updates to each connection
		const connectionId = Date.now()
		const newConnection = {
			connectionId,
			user,
			userSub,
			userSessionState,
			res
		}
		connections.push(newConnection)
		console.log(
			'connections:',
			connections.map(c => c.connectionId)
		)

		// When user closes connection we update the connections-list
		// avoiding the disconnected one
		req.on('close', () => {
			console.log(`${connectionId} Connection closed`)
			connections = connections.filter(c => c.connectionId !== connectionId)
		})

		req.on('end', () => {
			console.log(`${connectionId} Connection ended`)
			connections = connections.filter(c => c.connectionId !== connectionId)
		})
	} else {
		res.status(200).send('Welcome to SSE-server')
	}
})

// Iterate connections-list and use write res object method to send new state
function sendEventsToAll(payload) {
	connections.forEach(c => {
		if (c.user === payload.user) {
			c.res.write('event: state' + '\n')
			c.res.write(`data: ${JSON.stringify(payload.state)}\n\n`)
		}
	})
}

// eslint-disable-next-line require-await
app.post('/updatestate', async (req, res, next) => {
	const body = req.body
	states[body.user] = body.state
	// Send recently changed state as POST result
	res.json(body)
	// Invoke iterate and send function
	return sendEventsToAll(body)
})

app.get('/status', (req, res) => {
	console.log('connections:', connections)
	res.json({ connections: connections.length })
})

app.listen(PORT, err => {
	if (err) {
		console.log('Server cannot listen...')
		return
	}
	console.log(`Server listening on PORT ${PORT}`)
})
