const express = require('express')
const request = require('supertest')
const {Router} = require('express')
const Product = require('../../db/ProductModel')
const createProduct = require('../createProduct')
const bodyParser = require('body-parser')

let app

beforeEach(() => {
    app = express()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(createProduct(new Router()))
})

it('should create a product', async () => {
    // TODO: find way to test new Product is created/saved with correct fields from request body
    Product.prototype.save = jest.fn()
    Product.prototype.save.mockResolvedValueOnce({price: '$1.25', productId: '12345678'})

    const res = await request(app).post('/products').send({price: '$1.25', productId: '12345678'})

    expect(Product.prototype.save).toHaveBeenCalled()
    expect(res.body).toEqual({price: '$1.25', productId: '12345678'})
    expect(res.status).toEqual(200)
})

it('should not create a product with invalid price', async () => {
    const res = await request(app).post('/products').send({price: '$1.2', productId: '12345678'})

    expect(Product.prototype.save).not.toHaveBeenCalled()
    expect(res.body).toEqual(['"price" with value "$1.2" fails to match the US dollar, $1,000.00 format pattern'])
    expect(res.status).toEqual(400)
})

it('should not create a product with invalid productId', async () => {
    const res = await request(app).post('/products').send({price: '$1.25', productId: '1234567'})

    expect(Product.prototype.save).not.toHaveBeenCalled()
    expect(res.body).toEqual(['"productId" must be larger than or equal to 10000000'])
    expect(res.status).toEqual(400)
})

it('should handle generic error from database', async () => {
    Product.prototype.save = jest.fn()
    Product.prototype.save.mockRejectedValueOnce({error: 'something bad happened'})

    const res = await request(app).post('/products').send({price: '$1.25', productId: '12345678'})

    expect(Product.prototype.save).toHaveBeenCalled()
    expect(res.body).toEqual({error: 'An error occured, contact administrator'})
    expect(res.status).toEqual(500)
})

it('should handle duplicate productId key error from database', async () => {
    Product.prototype.save = jest.fn()
    Product.prototype.save.mockRejectedValueOnce({error: 'something bad happened', code: 11000})

    const res = await request(app).post('/products').send({price: '$1.25', productId: '12345678'})

    expect(Product.prototype.save).toHaveBeenCalled()
    expect(res.body).toEqual({error: 'productId 12345678 already in use'})
    expect(res.status).toEqual(409)
})
