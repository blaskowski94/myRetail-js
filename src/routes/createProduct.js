const Joi = require('joi')
const _ = require('lodash')
const mongoose = require('mongoose')
const Product = mongoose.model('Product')
const schemaValidator = require('../util/schemaValidator')

const schema = {
    body: Joi.object().keys({
        productId: Joi.number().integer().min(10000000).max(99999999).required(),
        price: Joi.string().regex(/^\$?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$/, 'US dollar, $1,000.00 format').required()
    })
}

module.exports = router =>
    router.post('/products', schemaValidator(schema), async (req, res) => {
        try {
            const newProduct = new Product(req.body)
            const {productId, price} = await newProduct.save()
            console.log(`POST successful: ${productId}`)
            res.json({productId, price})
        } catch (error) {
            console.error(error)
            if (_.get(error, 'code') === 11000) res.status(409).json({error: `productId ${req.body.productId} already in use`})
            else res.status(500).json({error: 'An error occured, contact administrator'})
        }
    })

