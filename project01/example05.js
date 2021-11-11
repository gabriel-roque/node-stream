// nodemon project01/example05.js

import { pipeline, Readable, Writable, Transform } from 'stream'
import { promisify } from 'util'
import { createWriteStream } from 'fs';

const pipelineAsync = promisify(pipeline)

const readableStream = new Readable({
  read: function () {
    for (let index = 0; index < 1e5; index++) {
      const person = { id: Date.now() + index, name: `John Due-${index}` }
      const data = JSON.stringify(person)
      this.push(data)
    }
    this.push(null)
  }
})

const writableMaptoCSV = new Transform({
  transform: (chunk, encondig, cb) => {
    const data = JSON.parse(chunk)
    const result = `${data.id},${String(data.name).toUpperCase()}\n`

    cb(null, result)
  }
})

let counter
const setHeader = new Transform({
  transform: (chunk, encoding, cb) => {
    counter = counter ?? 0
    if (counter) {
      return cb(null, chunk)
    }

    counter++

    cb(null, "id,name\n".concat(chunk))
  }
})


const writableStream = new Writable({
  write: (chunk, encoding, cb) => {
    console.log(chunk);
    console.log('chunk >>>', chunk, Buffer.from(chunk).toString('utf-8'));
    cb()
  }
})


async function run () {
  await pipelineAsync(
    readableStream,
    writableMaptoCSV,
    setHeader,
    // writableStream,
    createWriteStream('my.csv')
  ).finally(() => console.log('Finish Stream!'))
}

run()
