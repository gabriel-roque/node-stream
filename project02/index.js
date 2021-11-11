import { dirname, join } from 'path'
import { promisify } from 'util'
import { promises, createReadStream, createWriteStream } from 'fs';
import { pipeline, Transform } from 'stream';
import csvtojson from 'csvtojson';
import jsontocsv from 'json-to-csv-stream';
import StreamConcat from 'stream-concat';

// nodemon project02/index.js
// clinic doctor -- node project02/index.js

const pipelineAync = promisify(pipeline)
const { readdir } = promises

const { pathname: currentFile } = new URL(import.meta.url)

const cwd = dirname(currentFile)
const fileDir = `${cwd}/dataset`
const output = `${cwd}/final.csv`

console.time('concat-data');
const files = (await readdir(fileDir))
  .filter(item => !(!!~item.indexOf('.zip')))

console.log(`processing ${files}`)
const ONE_SECOND = 1000
// quando os outro processos acabarem ele morre junto usando o .unref()
setInterval(() => process.stdout.write('.'), ONE_SECOND).unref()

// const combinedStreams = createReadStream(join(fileDir, files[0]))
const streams = files.map(item => createReadStream(join(fileDir, item)))
const combinedStreams = new StreamConcat(streams)

const finalSream = createWriteStream(output)
const handleStream = new Transform({
  transform: (chunk, encoding, cb) => {
    const data = JSON.parse(chunk)
    const output = {
      id: data.Respondent,
      country: data.Country
    }
    // console.log(`ID: ${output.id}`);
    return cb(null, JSON.stringify(output))
  }
})

await pipelineAync(
  combinedStreams,
  csvtojson(),
  handleStream,
  jsontocsv(),
  finalSream
)
console.log(`${files.length} files merged! on ${output}`)
console.timeEnd('concat-data')