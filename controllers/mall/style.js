var requestData = async (ctx) => {
    return new Promise((resolve, reject) => {
      var http = require('http')  
      var querystring = require('querystring') 
    
      const postData = querystring.stringify(ctx.request.body)

      const options = {
        hostname: 'debug.api.banchengyun.com',
        port: 80,
        path: '/mall/goods/style',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      }

      const req = http.request(options, (res) => {
        res.setEncoding('utf8')
        res.on('data', (chunk) => {
          ctx.state.chunk = chunk
          resolve()
        })
      })

      req.on('error', (e) => {
        console.error(`请求遇到问题: ${e.message}`)
      })

      req.write(postData)
      req.end()

    })
}

var style = async (ctx, next) => {
    await requestData(ctx)
    ctx.response.body = ctx.state.chunk
}

module.exports = {
    'GET /style': style,
    'POST /style': style,
}