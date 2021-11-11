// nodemon project01/example03.cjs

const { createServer } = require('net')

// Packger Net is Duplex channel, Read and Write Stream
createServer(socket => socket.pipe(process.stdout)).listen(1338)
// node -e "process.stdin.pipe(require('net').connect(1338))"