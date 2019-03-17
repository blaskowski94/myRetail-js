const express = require('express')
app = express()
port = process.env.PORT || 3000
mongoose = require('mongoose')
Product = require('./api/models/myRetailModel') //created model loading here
bodyParser = require('body-parser')

// mongoose instance connection url connection
mongoose.connect('mongodb://localhost/myRetailDb', {useNewUrlParser: true, useCreateIndex: true})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', async () => {
    try {
        const pro = new Product({productId: 50000000, price: '$5.25'})
        await pro.save()
    } catch (ex) {}
    app.emit('ready')
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const routes = require('./api/routes/myRetailRoutes') //importing route
routes(app) //register the route

app.on('ready', function() {
    app.listen(3000, function() {
        console.log('app is ready')
    })
})

console.log('myRetail RESTful API server started on: ' + port)

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found on server'})
})

