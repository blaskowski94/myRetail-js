const express = require('express')
const request = require('supertest')
const {Router} = require('express')
const Product = require('../../db/ProductModel')
const listProducts = require('../listProducts')

let app

beforeAll(() => {
    Product.find = jest.fn()
})

beforeEach(() => {
    app = express()
    app.use(listProducts(new Router()))
})

it('should list products', async () => {
    Product.find.mockResolvedValueOnce([{productId: '12345678', price: '$1.25', id: 'abc123'}, {productId: '87654321', price: '$5.21', id: 'xyz987'}])

    const res = await request(app).get('/products')
    
    expect(Product.find).toHaveBeenCalledWith({})
    expect(res.body).toEqual([{productId: '12345678', price: '$1.25'}, {productId: '87654321', price: '$5.21'}])
    expect(res.status).toEqual(200)
})

it('should handle generic error from database', async () => {
    Product.find.mockRejectedValueOnce({error: 'invalid request'})

    const res = await request(app).get('/products')
    
    expect(Product.find).toHaveBeenCalledWith({})
    expect(res.body).toEqual({error: 'An error occured, contact administrator'})
    expect(res.status).toEqual(500)
})
