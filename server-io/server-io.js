// const path = require('path')
const app = require('express')()
const bodyParser = require('body-parser')

// Set express middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// eslint-disable-next-line import/order
const http = require('http').createServer(app)

const io = require('socket.io')(http, {
	path: '/emobstate',
	// transports: ['websocket'],
	serveClient: false,
	perMessageDeflate: false,
	// cors in socket.io v2:
	origins: ['http://localhost:3000'],
	handlePreflightRequest: (req, res) => {
		res.writeHead(200, {
			'Access-Control-Allow-Origin': 'http://localhost:3000',
			'Access-Control-Allow-Methods': 'GET,POST',
			// "user" is a custom header sent from FE
			'Access-Control-Allow-Headers': ['user', 'Authorization', 'Content-Type'],
			'Access-Control-Allow-Credentials': true
		})
		res.end()
	}
	// cors in socket.io v3:
	// cors: {
	// 	// credentials: true,
	// 	// origin: 'http://localhost:3000',
	// 	origin: '*',
	// 	methods: ['GET', 'POST']
	// 	// allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
	// }
})

const PORT = 5000
const states = {
	alec: 'DISCONNECTED',
	domi: 'DISCONNECTED'
}

// app.get('/change', (req, res) => {
// 	res.sendFile(path.join(__dirname, 'index.html'))
// })

// TODO:
// registers a middleware for the default namespace
// checks, if token is valid
io.use((socket, next) => {
	next()
	// const { authorization } = socket.request.headers
	// if (tokenIsValid(authorization)) {
	// 	next()
	// } else {
	// 	next(new Error('invalid'))
	// }
})

io.on('connection', socket => {
	const { user } = socket.handshake.headers
	console.log(`user "${user}" connected`)

	// create a "room" for this user
	socket.join(user)
	// sent message to this room -> meaning, to every logged-in instance
	io.to(user).emit('state', states[user])

	// example for receiving events from client
	// socket.on('getMessage', m => {
	// 	console.log('msg: ', m)
	// })

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})

// pass io to express route handlers
app.use(function (req, res, next) {
	res.io = io
	next()
})

http.listen(PORT, () => {
	console.log(`listening on Port: ${PORT}`)
})

// eslint-disable-next-line require-await
app.post('/updatestate', async (req, res, next) => {
	const body = req.body
	states[body.user] = body.state
	res.io.sockets.to(body.user).emit('state', body.state)
	// Print recently changed state as POST result
	res.json(body)
})
