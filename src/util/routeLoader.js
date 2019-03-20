const express = require('express')
const router = express.Router()

const getProducts = require('../routes/getProduct')
const listProducts = require('../routes/listProducts')
const deleteProduct = require('../routes/deleteProduct')
const updateProduct = require('../routes/updateProduct')
const createProduct = require('../routes/createProduct')

// TODO: load routes dynamically
const routes = [getProducts, listProducts, deleteProduct, updateProduct, createProduct]
routes.map(route => route(router))

module.exports = router
