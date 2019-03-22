const Joi = require('joi')
const schemaValidator = require('../util/schemaValidator')
const mongoose = require('mongoose')
const Product = mongoose.model('Product')

const schema = {
    params: Joi.object().keys({
        id: Joi.number().integer().min(10000000).max(99999999).required()
    }),
    body: Joi.object().keys({
        price: Joi.string().regex(/^\$?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$/, 'US dollar, $1,000.00 format').required()
    })
}

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     name: Update Product
 *     summary: Upsert product's price in database
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: id of product to be updated
 *         type: integer
 *         example: 12345678
 *         required: true
 *       - in: body
 *         name: price
 *         description: new price of the product
 *         type: string
 *         example: {"price": "$1,000.25"}
 *         required: true
 *     responses:
 *       '200':
 *         description: Product updated in db
 *         schema:
 *           $ref: '#/definitions/Product'
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Problem communicating with db
 */
// TODO: change to insesrt and 404 if not found?
module.exports = router => 
    router.put('/products/:id', schemaValidator(schema), async (req, res) => {
        try {
            let {productId, price} = await Product.findOneAndUpdate({productId: req.params.id}, req.body, {
                new: true, runValidators: true, upsert: true
            })
            console.log(`Update successful: ${productId}`)
            res.json({productId, price})
        } catch (error) {
            console.error(error)
            res.status(500).json({error: 'An error occured, contact administrator'})
        }
    })
