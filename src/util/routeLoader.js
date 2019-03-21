const express = require('express')
const router = express.Router()
const fs = require('fs')

const routePath = __dirname + '/../routes/'

console.log('loading routes...')
fs.readdirSync(routePath).forEach(file => {
    const path = routePath + file
    const extension = path.split('.').pop()
    if (fs.lstatSync(path).isFile() && extension === 'js') require(path)(router)
})

module.exports = router
