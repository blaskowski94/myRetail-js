const Joi = require('joi')
const _ = require('lodash')
const fetch = require('node-fetch')
const mongoose = require('mongoose')
const schemaValidator = require('../util/schemaValidator')
const Product = mongoose.model('Product')

const schema = {
    params: Joi.object().keys({
        id: Joi.number().integer().min(10000000).max(99999999).required()
    })
}
const apiUrl = productId => `https://redsky.target.com/v2/pdp/tcin/${productId}?excludes=taxonomy,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics,esp,deep_red_labels,available_to_promise_network`

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     name: Get Product
 *     summary: Get product name from redsky API and price from database
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       '200':
 *         description: A single product object
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 12345678
 *             name:
 *               type: string
 *               example: 'Xbox Controller'
 *             price:
 *               type: object
 *               properties:
 *                 value:
 *                   type: float
 *                   example: 1234.56
 *                 currency_code:
 *                   type: string
 *                   example: 'USD'
 *       '400':
 *         description: Validation error
 *       '404':
 *         description: Product not found in redsky API or in database
 *       '500':
 *         description: Problem communicating with db
 */
module.exports = router =>
    router.get('/products/:id', schemaValidator(schema), async (req, res) => {
        try {
            const id = req.params.id
            const apiProduct = await (await fetch(apiUrl(id))).json()
            const name = _.get(apiProduct, 'product.item.product_description.title', 'Unavailable')
            const apiPrice = _.get(apiProduct, 'product.price.listPrice.minPrice') || _.get(apiProduct, 'product.price.listPrice.price', 'Unavailable')
            console.log(apiPrice)
            const dbProduct = await Product.findOne({id})
            let current_price = _.get(dbProduct, 'current_price', 'Unavailable')

            // add price from API to db if no price currently in db
            if (current_price === 'Unavailable' && _.isNumber(apiPrice)) {
                const {current_price: newPrice} = await Product.findOneAndUpdate({id}, {current_price: {value: apiPrice, currency_code: 'USD'}}, {
                    new: true, runValidators: true, upsert: true
                })
                current_price = newPrice
            }

            // if no price or title found, return 404
            if (current_price === 'Unavailable' && name === 'Unavailable') {
                console.log(`404: Product with id ${id} could not be found`)
                res.status(404).json({error: `Product with id ${id} could not be found`})
            } else {
                console.log(`GET successful: {id: ${id}, name: ${name}, current_price: ${current_price}}`)
                res.json({id, name, current_price})
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({error: 'An error occured, contact administrator'})
        }
    })
