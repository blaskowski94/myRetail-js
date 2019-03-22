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
const apiUrl = productId => `https://redsky.target.com/v2/pdp/tcin/${productId}?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics,esp,deep_red_labels,available_to_promise_network`

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
 *             productId:
 *               type: integer
 *               example: 12345678
 *             productName:
 *               type: string
 *               example: 'Xbox Controller'
 *             price:
 *               type: string
 *               example: '$1,234.25'
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Problem communicating with db
 */
// TODO: write price from request to database if price not found?
// TODO: return 404 if neither found
module.exports = router =>
    router.get('/products/:id', schemaValidator(schema), async (req, res) => {
        try {
            const productId = req.params.id
            const apiProduct = await (await fetch(apiUrl(productId))).json()
            const productName = _.get(apiProduct, 'product.item.product_description.title', 'Unavailable')

            const dbProduct = await Product.findOne({productId})
            const productPrice = _.get(dbProduct, 'price', 'Unavailable')

            console.log(`GET successful: {productName: ${productName}, productPrice: ${productPrice}}`)
            res.json({productId, productName, productPrice})
        } catch (error) {
            console.error(error)
            res.status(500).json({error: 'An error occured, contact administrator'})
        }
    })
