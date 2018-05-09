function websocket(server) {
	const io = require('socket.io')(server)

    let socketsMap = {}
    let counter = 0
    
    io.on('connection', (socket) => {
    	counter++
        socketsMap[counter] = socket
        socket.counter = counter

        if (socket.counter % 2 === 0) {
            socket.emit('start', {
                msg: 'playing'
            })
            socketsMap[socket.counter - 1].emit('start', {
                msg: 'playing',
                turn: true,
            })
        }  

        socket.on('draw', (index) => {
            let socketIndex   = socket.counter
            let anotherSocket = socketIndex % 2 === 0 ? socketsMap[socketIndex - 1] : socketsMap[socketIndex + 1]
            
            anotherSocket.emit('draw', index)
            
        })

        socket.on('end', (msg) => {
            let socketIndex   = socket.counter
            let anotherSocket = socketIndex % 2 === 0 ? socketsMap[socketIndex - 1] : socketsMap[socketIndex + 1]

            socket.emit('end', msg)
            anotherSocket.emit('end', msg)
        })
   
    })
}

module.exports = websocket