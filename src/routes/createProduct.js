const Joi = require('joi')
const _ = require('lodash')
const mongoose = require('mongoose')
const Product = mongoose.model('Product')
const schemaValidator = require('../util/schemaValidator')

const schema = {
    body: Joi.object().keys({
        id: Joi.number().integer().min(10000000).max(99999999).required(),
        current_price: Joi.object().keys({
            value: Joi.number().precision(2).strict().positive().required(),
            currency_code: Joi.string().required()
        })
    })
}

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     name: Create Product
 *     summary: Create product in database
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: product
 *         schema:
 *           $ref: '#/definitions/Product'
 *     responses:
 *       '200':
 *         description: Product created in db
 *         schema:
 *           $ref: '#/definitions/Product'
 *       '400':
 *         description: Validation error
 *       '409':
 *         description: Duplicate productId
 *       '500':
 *         description: Problem communicating with db
 */
module.exports = router =>
    router.post('/products', schemaValidator(schema), async (req, res) => {
        try {
            const newProduct = new Product(req.body)
            const {id, current_price} = await newProduct.save()
            console.log(`POST successful: ${id}`)
            res.json({id, current_price})
        } catch (error) {
            console.error(error)
            if (_.get(error, 'code') === 11000) res.status(409).json({error: `id ${req.body.id} already in use`})
            else res.status(500).json({error: 'An error occured, contact administrator'})
        }
    })

