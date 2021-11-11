/* 
  Pipe's de write stream pode causar vazamento de memória, e como podemos ter vários pipe
  eventualmente algum pode causar erro e não ter uma tratativa adequada
*/

// nodemon project01/example04.js

import { pipeline, Readable, Writable } from 'stream'
import { promisify } from 'util';

const pipelineAsync = promisify(pipeline)

const readableStream = new Readable({
  read: function () {
    this.push('Hello Dude!! 0')
    this.push('Hello Dude!! 1')
    this.push('Hello Dude!! 2')
    this.push(null)
  }
})

const writableStream = new Writable({
  write (chunk, encoding, cb) {
    console.log('chunk >>>', chunk, Buffer.from(chunk).toString('utf-8'));
    cb()
  }
})

async function run () {
  await pipelineAsync(
    readableStream,
    writableStream
    // process.stdout
  )
}

run()

