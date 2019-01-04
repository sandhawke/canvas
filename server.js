const startServer = require('webdup/start-server')
// server.offerDataset() ?
const delay = require('delay')
const express = require('express')   // SHOULD get this from appmgr

const run = async () => {
  const server = await startServer()
  server.app.use(express.json())
  console.log('server.siteurl: %o', server.siteurl)

  console.log(`Try:
curl -I ${server.siteurl}/canvas.json
curl -v ${server.siteurl}/canvas.json
curl ${server.siteurl}/canvas.json.webdup
`)

  server.app.get('/', (req, res) => {
    res.send('<html><body>Try <a href="static/canvas">canvas</a>')
  })
  
  const set = server.offerDataset(`/canvas.json`)

  server.app.post('/canvas.json', (req, res) => {
    console.log('shape', req.body)
    set.add(req.body)
    console.log('added shape', req.body)
    res.send('ok')
  })
  

  
  //   set.add(shape) all the stored ones

  const alive = { type: 'circle', x: 100, y: 100, radius:100, color: 'green' }
  while (true) {
    set.add(alive)
    await delay(1000)
    set.delete(alive)
    await delay(1000)
    alive.radius += 1
  }
}

run()
