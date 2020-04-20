import bodyParser from 'body-parser'
import { config } from 'dotenv'
import express from 'express'
import https from 'https'
import { apiController } from './api'

config()

const port = process.env.PORT ?? 3000
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', apiController)

app.get('/status', (req, res) => {
  res.status(200).send('ok')
})

app.listen(port)

const statusUrl = process.env.bot_status_url
if (statusUrl) {
  setInterval(() => {
    https.get(statusUrl)
  }, 1000 * 60 * 25)
} else {
  console.warn('"bot_status" variable isn\'t set')
}
