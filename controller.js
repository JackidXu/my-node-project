const fs = require('fs')

function addMapping(router, project, mapping) {
    project = '/' + project

    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = project + url.substring(4)
            router.get(path, mapping[url])
        } else if (url.startsWith('POST ')) {
            var path = project + url.substring(5)
            router.post(path, mapping[url])
        } else if (url.startsWith('PUT ')) {
            var path = project + url.substring(4) 
            router.put(path, mapping[url])
        } else if (url.startsWith('DELETE ')) {
            var path = project + url.substring(7)
            router.del(path, mapping[url])
        } else {
            console.log(`invalid URL: ${url}`)
        }
    }
}

function addControllers(router, dir) {
    let controllers_dir = `${__dirname}/${dir}`

    fs.readdirSync(controllers_dir).filter((project) => {
        fs.readdirSync(`${controllers_dir}/${project}`).filter((file) => {
            return file.endsWith('.js')
        }).forEach((file) => {
            let mapping = require(`${controllers_dir}/${project}/${file}`)
            addMapping(router, project, mapping)
        })
    })
}

module.exports = function (dir) {
    let
        controllers_dir = dir || 'controllers',
        router = require('koa-router')()
    addControllers(router, controllers_dir)
    return router.routes()
}