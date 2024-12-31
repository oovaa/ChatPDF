import express, { json } from 'express'
import logger from './src/middleware/logger.js'

const app = express()
const port = 3000

app.use(logger)
app.use(express.json())

app.get('/', (req, res) => res.status(200).send('all good'))
app.post('/', (req, res) => {
  res.status(200).send('all good')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}
  access it with the link http://localhost:3000/`)
})
