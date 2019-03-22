const swaggerDefinition = {
    swagger: '2.0',
    info: {
        title: 'myRetail RESTful API',
        version: '0.0.1',
        description: 'POC for exposing myRetail internal data to client devices'
    },
    license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
    },
    contact: {
        name: 'Bob Laskowski',
        email: 'blaskowski94@gmail.com',
        url: 'www.boblaskowski.com'
    },
    tags: ['Product'],
    host: 'localhost:3000',
    basePath: '/'
}

module.exports = {
    swaggerDefinition,
    apis: ['src/routes/*.js', 'src/db/*.js']
}
