const https = require('https')
const querystring = require('querystring')

const commonData = {
    app: {
        share: {
            display: true,
            friend: true,
            poster: true,
        }
    }
}

var requestData = async(ctx, config) => {
    return new Promise((resolve, reject) => {
        config.data = querystring.stringify(Object.assign(ctx.request.body, config.data))

        const options = {
            hostname: config.hostname || 'api.banchengyun.com',
            port: config.port || 443,
            path: config.path || '',
            method: config.method || 'POST',
            headers: config.headers || {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(config.data),
            }
        }

        const req = https.request(options, (res) => {
            res.setEncoding('utf8')
            let rawData = ''
            res.on('data', (chunk) => {
                rawData += chunk
            })
            res.on('end', () => {
                try {
                    ctx.state.resData = JSON.parse(rawData)
                    ctx.state.resData.data = Object.assign(commonData, ctx.state.resData.data)
                } catch (err) {
                    ctx.state.errorData.msg = err.message
                    ctx.state.resData = ctx.state.errorData
                }
                resolve(ctx)
            })
        })

        req.on('error', (e) => {
            ctx.state.errorData.msg = e.message
            ctx.state.resData = ctx.state.errorData
            resolve(ctx)
        })

        req.write(config.data)
        req.end()
    }) 
}

module.exports = requestData