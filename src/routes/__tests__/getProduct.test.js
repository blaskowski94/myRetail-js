const express = require('express')
const request = require('supertest')
const {Router} = require('express')
const Product = require('../../db/ProductModel')
const getProduct = require('../getProduct')
const fetch = require('node-fetch')

let app

beforeAll(() => {
    Product.findOne = jest.fn()
})

beforeEach(() => {
    app = express()
    app.use(getProduct(new Router()))
})

it('should get a product with name and price', async () => {
    Product.findOne.mockResolvedValueOnce({productId: '12345678', price: '$1.25'})
    fetch.mockResponse(JSON.stringify({product: {item: {product_description: {title: 'awesome product'}}}}))

    const res = await request(app).get('/products/12345678')

    expect(fetch).toHaveBeenCalledWith('https://redsky.target.com/v2/pdp/tcin/12345678?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics,esp,deep_red_labels,available_to_promise_network')
    expect(Product.findOne).toHaveBeenCalledWith({productId: '12345678'})
    expect(res.body).toEqual({productId: '12345678', productName: 'awesome product', productPrice: '$1.25'})
    expect(res.status).toEqual(200)
})

it('should get a product with only price', async () => {
    Product.findOne.mockResolvedValueOnce({productId: '12345678', price: '$1.25'})
    fetch.mockResponse(JSON.stringify({}))

    const res = await request(app).get('/products/12345678')

    expect(fetch).toHaveBeenCalledWith('https://redsky.target.com/v2/pdp/tcin/12345678?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics,esp,deep_red_labels,available_to_promise_network')
    expect(Product.findOne).toHaveBeenCalledWith({productId: '12345678'})
    expect(res.body).toEqual({productId: '12345678', productName: 'Unavailable', productPrice: '$1.25'})
    expect(res.status).toEqual(200)
})

it('should get a product with only name', async () => {
    Product.findOne.mockResolvedValueOnce({})
    fetch.mockResponse(JSON.stringify({product: {item: {product_description: {title: 'awesome product'}}}}))

    const res = await request(app).get('/products/12345678')

    expect(fetch).toHaveBeenCalledWith('https://redsky.target.com/v2/pdp/tcin/12345678?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics,esp,deep_red_labels,available_to_promise_network')
    expect(Product.findOne).toHaveBeenCalledWith({productId: '12345678'})
    expect(res.body).toEqual({productId: '12345678', productName: 'awesome product', productPrice: 'Unavailable'})
    expect(res.status).toEqual(200)
})

it('should get a product with no name or price', async () => {
    Product.findOne.mockResolvedValueOnce({})
    fetch.mockResponse(JSON.stringify({}))

    const res = await request(app).get('/products/12345678')

    expect(fetch).toHaveBeenCalledWith('https://redsky.target.com/v2/pdp/tcin/12345678?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics,esp,deep_red_labels,available_to_promise_network')
    expect(Product.findOne).toHaveBeenCalledWith({productId: '12345678'})
    expect(res.body).toEqual({productId: '12345678', productName: 'Unavailable', productPrice: 'Unavailable'})
    expect(res.status).toEqual(200)
})

it('should handle error on fetch', async () => {
    fetch.mockRejectedValueOnce({})

    const res = await request(app).get('/products/12345678')

    expect(fetch).toHaveBeenCalledWith('https://redsky.target.com/v2/pdp/tcin/12345678?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics,esp,deep_red_labels,available_to_promise_network')
    expect(Product.findOne).not.toHaveBeenCalled()
    expect(res.body).toEqual({error: 'An error occured, contact administrator'})
    expect(res.status).toEqual(500)
})

it('should handle generic error from database', async () => {
    Product.findOne.mockRejectedValueOnce({error: 'invalid request'})
    fetch.mockResponse(JSON.stringify({product: {item: {product_description: {title: 'awesome product'}}}}))

    const res = await request(app).get('/products/12345678')

    expect(fetch).toHaveBeenCalledWith('https://redsky.target.com/v2/pdp/tcin/12345678?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics,esp,deep_red_labels,available_to_promise_network')
    expect(Product.findOne).toHaveBeenCalledWith({productId: '12345678'})
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
