const express = require('express')
const request = require('supertest')
const {Router} = require('express')
const Product = require('../../db/ProductModel')
const updateProduct = require('../updateProduct')
const bodyParser = require('body-parser')

let app

beforeAll(() => {
    Product.findOneAndUpdate = jest.fn()
})

beforeEach(() => {
    app = express()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(updateProduct(new Router()))
})

it('should update a product', async () => {
    Product.findOneAndUpdate.mockResolvedValueOnce({price: '$1.25', productId: '12345678'})

    const res = await request(app).put('/products/12345678').send({price: '$1.25'})
    
    expect(Product.findOneAndUpdate).toHaveBeenCalledWith({productId: '12345678'}, {price: '$1.25'}, {new: true, runValidators: true, upsert: true})
    expect(res.body).toEqual({price: '$1.25', productId: '12345678'})
    expect(res.status).toEqual(200)
})

it('should not create a product with invalid price', async () => {
    const res = await request(app).put('/products/12345678').send({price: '$1.2'})
    
    expect(Product.findOneAndUpdate).not.toHaveBeenCalled()
    expect(res.body).toEqual(['"price" with value "$1.2" fails to match the US dollar, $1,000.00 format pattern'])
    expect(res.status).toEqual(400)
})

it('should not create a product with invalid productId', async () => {
    const res = await request(app).put('/products/1234567').send({price: '$1.25'})
    
    expect(Product.findOneAndUpdate).not.toHaveBeenCalled()
    expect(res.body).toEqual(['"id" must be larger than or equal to 10000000'])
    expect(res.status).toEqual(400)
})

it('should handle generic error from database', async () => {
    Product.findOneAndUpdate.mockRejectedValueOnce({error: 'something bad happened'})

    const res = await request(app).put('/products/12345678').send({price: '$1.25'})
    
    expect(Product.findOneAndUpdate).toHaveBeenCalledWith({productId: '12345678'}, {price: '$1.25'}, {new: true, runValidators: true, upsert: true})
    expect(res.body).toEqual({error: 'An error occured, contact administrator'})
    expect(res.status).toEqual(500)
})
