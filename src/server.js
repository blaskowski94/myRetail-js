const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Product = require('./api/models/myRetailModel')
const routes = require('./api/routes/myRetailRoutes')

const port = process.env.PORT || 3000
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
routes(app) 
app.on('ready', () => {
    app.listen(port, () => {
        console.log(`myRetail RESTful service is ready, listening on port ${port}`)
    })
})
app.use((req, res) => {
    res.status(404).send({url: req.originalUrl + ' not found on server'})
})

// connect to mongodb
mongoose.connect('mongodb://localhost/myRetailDb', {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    // TODO: load default data here
    app.emit('ready')
})
