let login = async (ctx, next) => {
    const User = require('../models/usersModel')

    const loginUser = new User({ 
        name: ctx.request.body.name, 
        psw: ctx.request.body.psw, 
    })
    loginUser.save().then(() => console.log('save'))

    ctx.response.body = {
        status: 1
    }
}

// var register = async (ctx, next) => {
//     const User = require('../models/usersModel')

//     const loginUser = new User({ 
//         name: ctx.request.body.name, 
//         psw: ctx.request.body.psw, 
//     })
//     loginUser.save().then(() => console.log('save'))

//     ctx.response.body = {
//         status: 1
//     }
// }

module.exports = {
    'POST /login': login,
    // 'POST /register': register,
}