const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const controller = require('./controller')

const app = new Koa()

// const server = require('http').Server(app.callback())

// server init:
app.use(async (ctx, next) => {
	ctx.set('Access-Control-Allow-Origin', '*')
	ctx.set('Access-Control-Allow-Credentials', 'true')
    ctx.response.type = 'application/json'

    console.log(process.env)

    try {
	    await next()
	} catch (err) {
	    ctx.response.status = err.statusCode || err.status || 500
	    ctx.response.body = {
	        message: err.message
	    }
	}
})

// parse request body:
app.use(bodyParser())

// add controllers:
app.use(controller())

app.on('error', err => {
	console.log('server error', err)
})

app.listen(3000)
console.log('app started at port 3000...')

// websocket
// require('./servers/websocket.js')(server)

// server.listen(3000)



