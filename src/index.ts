import bodyParser from 'body-parser'
import { config } from 'dotenv'
import express from 'express'
import { Api } from './api'

config()

const port = process.env.PORT ?? 3000
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/api', Api)
app.listen(port)
