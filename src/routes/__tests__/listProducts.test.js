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
    Product.find.mockResolvedValueOnce([{id: '12345678', current_price: {value: 1.25, currency_code: 'USD'}, _id: 'abc123'}, {id: '87654321', current_price: {value: 5.21, currency_code: 'USD'}, _id: 'xyz987'}])

    const res = await request(app).get('/products')

    expect(Product.find).toHaveBeenCalledWith({})
    expect(res.body).toEqual([{id: '12345678', current_price: {value: 1.25, currency_code: 'USD'}}, {id: '87654321', current_price: {value: 5.21, currency_code: 'USD'}}])
    expect(res.status).toEqual(200)
})

it('should handle generic error from database', async () => {
    Product.find.mockRejectedValueOnce({error: 'invalid request'})

    const res = await request(app).get('/products')

    expect(Product.find).toHaveBeenCalledWith({})
    expect(res.body).toEqual({error: 'An error occured, contact administrator'})
    expect(res.status).toEqual(500)
})
