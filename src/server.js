require('./api/models/myRetailModel')
const routes = require('./api/routes/myRetailRoutes')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const port = process.env.PORT || 3000
const password = process.env.PASSWORD
const user = process.env.USER
const app = express()

// TODO: load data into DB
// connect to mongodb, then configure & start server
mongoose.connect(`mongodb+srv://${user}:${password}@myretaildbcluster-nqsoj.mongodb.net/test?retryWrites=true`,
    {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
        .then(() => {
            console.log('Database connection successful')
            
            app.use(bodyParser.urlencoded({extended: true}))
            app.use(bodyParser.json())
            routes(app)
            app.use((req, res) => {
                res.status(404).send({url: req.originalUrl + ' not found on server'})
            })
            app.listen(port, () => {
                console.log(`myRetail RESTful service is ready, listening on port ${port}`)
            })
        })
        .catch(error => {
            console.error('App starting error:', error.stack)
            process.exit(1)
        })
