const express = require('express')
const request = require('supertest')
const {Router} = require('express')
const Product = require('../../db/ProductModel')
const deleteProduct = require('../deleteProduct')

let app

beforeAll(() => {
    Product.deleteOne = jest.fn()
})

beforeEach(() => {
    app = express()
    app.use(deleteProduct(new Router()))
})

it('should delete a product', async () => {
    Product.deleteOne.mockResolvedValueOnce({})

    const res = await request(app).delete('/products/12345678')
    expect(Product.deleteOne).toHaveBeenCalledWith({productId: '12345678'})
    expect(res.status).toEqual(204)
})

it('should handle generic error from database', async () => {
    Product.deleteOne.mockRejectedValueOnce({error: 'invalid request'})

    const res = await request(app).delete('/products/12345678')
    expect(Product.deleteOne).toHaveBeenCalledWith({productId: '12345678'})
    expect(res.body).toEqual({error: 'An error occured, contact administrator'})
    expect(res.status).toEqual(500)
})

it('should not delete with invalid productId param', async () => {
    const res = await request(app).delete('/products/1234567')
    expect(Product.deleteOne).not.toHaveBeenCalled()
    expect(res.body).toEqual(['"id" must be larger than or equal to 10000000'])
    expect(res.status).toEqual(400)
})
