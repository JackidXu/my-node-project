var handelData = (ctx) => {
	ctx.state.chunk.word = 'hello'
    return ctx
}

var test = async(ctx, next) => {
	await require('../../servers/request.js')(ctx, {
		path: '/mall/goods/item'
	})

	handelData(ctx)
	ctx.response.body = ctx.state.chunk
	const path = require('path')
	// console.log(__dirname)
	// console.log(__filename)
	// console.log(process.cwd())
	console.log(path.resolve(__dirname, 'index.js'))
	//console.log(path.join(__dirname, '..', 'index'))
}

module.exports = {
    'GET /test': test
}