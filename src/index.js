require('./db/ProductModel')
const routes = require('./routeLoader')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const swaggerConfig = require('./setupSwagger')

const port = process.env.PORT || 3000
const password = process.env.PASSWORD
const user = process.env.USER
const app = express()
const swaggerSpec = swaggerJSDoc(swaggerConfig)

// TODO: switch from console.log to a logger
// connect to mongodb, then configure & start server
console.log('connecting to database...')
mongoose.connect(`mongodb+srv://${user}:${password}@myretaildbcluster-nqsoj.mongodb.net/myRetail?retryWrites=true`,
    {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
    .then(() => {
        console.log('database connection successful...')
        console.log('starting server...')
        app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())
        app.use('/', routes)
        app.use((req, res) => {
            res.status(404).send()
        })
        app.listen(port, () => {
            console.log(`myRetail RESTful service is ready, listening on port ${port}`)
        })
    })
    .catch(error => {
        console.error('App starting error:', error.stack)
        process.exit(1)
    })
