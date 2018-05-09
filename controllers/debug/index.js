var fn_index = async (ctx, next) => {
    
    ctx.response.body = 'debug'
}

var requestData = async (ctx) => {
    return new Promise((resolve, reject) => {
      var http = require('http')  
      var querystring = require('querystring')

      console.log(ctx.request.body)  

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
        // console.log(`状态码: ${res.statusCode}`)
        // console.log(`响应头: ${JSON.stringify(res.headers)}`)
        res.setEncoding('utf8')
        res.on('data', (chunk) => {
          //console.log(`响应主体: ${chunk}`)
          ctx.state.chunk = chunk
          resolve()
        })
        // res.on('end', () => {
        //   console.log('响应中已无数据。')
        // })
      })

      // req.on('error', (e) => {
      //   console.error(`请求遇到问题: ${e.message}`)
      // })

      req.write(postData)
      req.end()

    })
}

var style = async (ctx, next) => {
    await requestData(ctx)
    ctx.response.body = ctx.state.chunk
}

var fn_signin = async (ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || ''
    console.log(`signin with name: ${name}, password: ${password}`)
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`
    }
}

module.exports = {
    'GET /': fn_index,
    'GET /style': style,
    'POST /style': style,
    'POST /signin': fn_signin
}