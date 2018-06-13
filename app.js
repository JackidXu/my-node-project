const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const controller = require('./controller')

const app = new Koa()

global.counter = 0

// server init:
app.use(async (ctx, next) => {
	ctx.set('Access-Control-Allow-Origin', '*')
	ctx.set('Access-Control-Allow-Credentials', 'true')
    ctx.response.type = 'application/json'

    ctx.state.errorData = {
        status: 0,
        data: {},
        info: `请求异常|请求出现问题`,
        msg: '',
    }

    global.request = require('./servers/request.js')

    try {
	    await next()
	} catch (err) {
	    ctx.response.status = err.statusCode || err.status || 500
	    ctx.state.errorData.msg = err.message
	    ctx.response.body = ctx.state.errorData
	}
})

// parse request body:
app.use(bodyParser())

// add controllers:
app.use(controller())

app.on('error', err => {
	console.log('server error', err)
	ctx.state.errorData.msg = err.message
	ctx.response.body = ctx.state.errorData
})

app.listen(3000)
console.log('app started at port 3000...')



