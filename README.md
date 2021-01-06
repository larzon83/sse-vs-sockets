# sse-vs-sockets

## Introduction

This nuxt-app has two routes:
- `/` for implementation of SSE
- `/io` for implementation of websockets via [socket.io](https://socket.io)

Each of these routes uses their own nodejs-express-server:
- For SSE -> folder `server-sse` -> runs on Port 4000
- For socket.io -> folder `server-io` -> runs on Port 5000

Also, the app uses keycloak for authentication.

## Setup

#### Install dependencies

```bash
# while in the project root
$ npm install

$ cd server-sse
$ npm install

$ cd server-io
$ npm install
```

#### Keycloak

A local keycloak is required for this project.

- it has to run on port `8080` (default)
- create a new Realm with the name `sse-vs-sockets`
- inside this realm create a new client with the name `app_sse-vs-sockets` with these settings:
  - Root URL: `http://localhost:3000`
  - Valid Redirect URIs: `/*`
  - Base URL: `/`
  - Admin URL: `http://localhost:3000`
  - Web Origins: `+`

*If you want different settings, change them accordingly in `/config/oidc.js`.*

Under "Users", create two new users named "alec" and "domi" to login with. These two users are used inside each server-file. If you want other or additional users, please search for `const states` inside each server-file and change to your liking.

#### Run

```bash
# serve the nuxt-app with hot reload at localhost:3000
$ npm run dev

# start sse-server on Port 4000
$ npm run sse

# start socket.io-server on Port 5000
$ npm run io
```

## Change state

You can use curl to POST to each server and change the state (see below) of a specific user. The body of the POST is an object which must contain the properties `state` and `user`.
<br />
The `state` can be any String. `user` must be the name of one of your keycloak-users.

This snippet shows, how to do a POST to the socket.io-server:
```bash
curl -X POST \
 -H "Content-Type: application/json" \
 -d '{"state": "BLUB", "user": "alec"}'\
 -s http://localhost:5000/updatestate
```

To do a POST to the sse-server, use the same snippet, but replace port 5000 with 4000.

## Additional Infos

Each server-file has a `const states` which kind of mimics a Database and holds the current state of each user.

```js
const states = {
  alec: 'DISCONNECTED',
  domi: 'DISCONNECTED'
}
```

We use the username here for simplicity. In real life, the `sub` found in the token should be used instead.

#### Notes about socket.io-server

There is a middleware defined in line 52 which is doing nothing at the moment. This would be the perfect moment to validate the token sent from the client and stop further processing if the token isn't valid.

It's possible that some corporate firewalls and some Antivirus software block Websocket events. But socket.io [claims](https://socket.io/docs/v3) that this is possible with socket.io. Has to be double checked....

#### Notes about SSE-server

It's not possible to add additional headers with an sse request. So one cannot send over a Bearer token.
<br />
To get this project working, the nuxt-app has a middleware (set-cookie.js) which sets username, sub and sessionState as cookies. Cookies can be read by the server. But this is probably insecure and shouldn't be used in production.
