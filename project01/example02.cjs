// nodemon project01/example02.cjs
// clinic doctor -- node project01/example02.cjs

const { createServer } = require('http')
const { readFileSync, createReadStream } = require('fs')

// GENERATE BIG FILE: node -e "process.stdout.write(crypto.randomBytes(1e9))" > big.file
createServer((req, res) => {
  // BAD SOLUCTION
  // const file = readFileSync('big.file')
  // res.write(file)
  // res.end()

  createReadStream('big.file')
    .pipe(res.on('pipe', (pipe) => pipe.on('data', (chunk) => console.log(chunk))))


}).listen(3000, () => console.log('server run in 3000'))

// Test it with: curl localhost:3000 --output output.txt