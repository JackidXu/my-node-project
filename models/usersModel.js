// const mongoose = require('mongoose')
// mongoose.connect('mongodb://localhost:27017/user')

// const User = mongoose.model('User', { 
// 	name: String,
// 	psw: String,
// })

// module.exports = User

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/user')

const UserSchema = require('./schemas/userSchema')
const User = mongoose.model('User',UserSchema)

module.exports = User