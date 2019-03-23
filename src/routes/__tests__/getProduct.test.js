const express = require('express')
const request = require('supertest')
const {Router} = require('express')
const Product = require('../../db/ProductModel')
const getProduct = require('../getProduct')
const fetch = require('node-fetch')

const apiUrl = 'https://redsky.target.com/v2/pdp/tcin/12345678?excludes=taxonomy,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics,esp,deep_red_labels,available_to_promise_network'
let app

beforeAll(() => {
    Product.findOne = jest.fn()
    Product.findOneAndUpdate = jest.fn()
})

beforeEach(() => {
    app = express()
    app.use(getProduct(new Router()))
})

it('should get a product with name and price', async () => {
    Product.findOne.mockResolvedValueOnce({current_price: {value: 1.25, currency_code: 'USD'}, id: '12345678'})
    fetch.mockResponse(JSON.stringify({product: {item: {product_description: {title: 'awesome product'}}}}))

    const res = await request(app).get('/products/12345678')

    expect(fetch).toHaveBeenCalledWith(apiUrl)
    expect(Product.findOne).toHaveBeenCalledWith({id: '12345678'})
    expect(res.body).toEqual({id: '12345678', name: 'awesome product', current_price: {value: 1.25, currency_code: 'USD'}})
    expect(res.status).toEqual(200)
})

it('should get a product with only price', async () => {
    Product.findOne.mockResolvedValueOnce({current_price: {value: 1.25, currency_code: 'USD'}, id: '12345678'})
    fetch.mockResponse(JSON.stringify({}))

    const res = await request(app).get('/products/12345678')

    expect(fetch).toHaveBeenCalledWith(apiUrl)
    expect(Product.findOne).toHaveBeenCalledWith({id: '12345678'})
    expect(res.body).toEqual({id: '12345678', name: 'Unavailable', current_price: {value: 1.25, currency_code: 'USD'}})
    expect(res.status).toEqual(200)
})

it('should get a product with only name', async () => {
    Product.findOne.mockResolvedValueOnce({})
    fetch.mockResponse(JSON.stringify({product: {item: {product_description: {title: 'awesome product'}}}}))

    const res = await request(app).get('/products/12345678')

    expect(fetch).toHaveBeenCalledWith(apiUrl)
    expect(Product.findOne).toHaveBeenCalledWith({id: '12345678'})
    expect(res.body).toEqual({id: '12345678', name: 'awesome product', current_price: 'Unavailable'})
    expect(res.status).toEqual(200)
})

it('should 404 for product with no name or price', async () => {
    Product.findOne.mockResolvedValueOnce({})
    fetch.mockResponse(JSON.stringify({}))

    const res = await request(app).get('/products/12345678')

    expect(fetch).toHaveBeenCalledWith(apiUrl)
    expect(Product.findOne).toHaveBeenCalledWith({id: '12345678'})
    expect(res.body).toEqual({error: 'Product with id 12345678 could not be found'})
    expect(res.status).toEqual(404)
})

it('should upsert product price if api has price and db does not', async () => {
    Product.findOne.mockResolvedValueOnce({})
    Product.findOneAndUpdate.mockResolvedValueOnce({current_price: {value: 19.99, currency_code: 'USD'}, id: '12345678'})
    fetch.mockResponse(JSON.stringify({product: {price: {listPrice: {price: 19.99}}, item: {product_description: {title: 'awesome product'}}}}))

    const res = await request(app).get('/products/12345678')

    expect(fetch).toHaveBeenCalledWith(apiUrl)
    expect(Product.findOne).toHaveBeenCalledWith({id: '12345678'})
    expect(Product.findOneAndUpdate).toHaveBeenCalledWith({id: '12345678'}, {current_price: {value: 19.99, currency_code: 'USD'}}, {new: true, runValidators: true, upsert: true})
    expect(res.body).toEqual({id: '12345678', name: 'awesome product', current_price: {value: 19.99, currency_code: 'USD'}})
    expect(res.status).toEqual(200)
})

it('should upsert product price if api has minPrice and db does not', async () => {
    Product.findOne.mockResolvedValueOnce({})
    Product.findOneAndUpdate.mockResolvedValueOnce({current_price: {value: 19.99, currency_code: 'USD'}, id: '12345678'})
    fetch.mockResponse(JSON.stringify({product: {price: {listPrice: {minPrice: 19.99}}, item: {product_description: {title: 'awesome product'}}}}))

    const res = await request(app).get('/products/12345678')

    expect(fetch).toHaveBeenCalledWith(apiUrl)
    expect(Product.findOne).toHaveBeenCalledWith({id: '12345678'})
    expect(Product.findOneAndUpdate).toHaveBeenCalledWith({id: '12345678'}, {current_price: {value: 19.99, currency_code: 'USD'}}, {new: true, runValidators: true, upsert: true})
    expect(res.body).toEqual({id: '12345678', name: 'awesome product', current_price: {value: 19.99, currency_code: 'USD'}})
    expect(res.status).toEqual(200)
})

it('should handle error on fetch', async () => {
    fetch.mockRejectedValueOnce({})

    const res = await request(app).get('/products/12345678')

    expect(fetch).toHaveBeenCalledWith(apiUrl)
    expect(Product.findOne).not.toHaveBeenCalled()
    expect(res.body).toEqual({error: 'An error occured, contact administrator'})
    expect(res.status).toEqual(500)
})

it('should handle generic error from database', async () => {
    Product.findOne.mockRejectedValueOnce({error: 'invalid request'})
    fetch.mockResponse(JSON.stringify({product: {item: {product_description: {title: 'awesome product'}}}}))

    const res = await request(app).get('/products/12345678')

    expect(fetch).toHaveBeenCalledWith(apiUrl)
    expect(Product.findOne).toHaveBeenCalledWith({id: '12345678'})
    expect(res.body).toEqual({error: 'An error occured, contact administrator'})
    expect(res.status).toEqual(500)
})

it('should not get with invalid productId param', async () => {
    const res = await request(app).get('/products/1234567')

    expect(Product.findOne).not.toHaveBeenCalled()
    expect(fetch).not.toHaveBeenCalled()
    expect(res.body).toEqual(['"id" must be larger than or equal to 10000000'])
    expect(res.status).toEqual(400)
})
