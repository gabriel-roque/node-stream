const stdin = process.stdin.on('data', msg => console.log('entrada terminal', msg.toString()))

stdin.pipe(process.stdout.on('data', msg => console.log('saída terminal', msg.toString())))