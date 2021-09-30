import http from 'http'
import { readFileSync, createReadStream, createWriteStream } from 'fs'

// GENERATE BIG FILE: node -e "process.stdout.write(crypto.randomBytes(1e9))" > big.file
http.createServer((req, res) => {
  // BAD SOLUCTION
  // const file = readFileSync('big.file')
  // res.write(file)
  // res.end()

  createReadStream('big.file')
    .pipe(res.on('pipe', (pipe) => pipe.on('data', (chunk) => console.log(chunk))))


}).listen(3000, () => console.log('server run in 3000'))
