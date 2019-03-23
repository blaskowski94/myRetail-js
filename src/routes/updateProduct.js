const Joi = require('joi')
const schemaValidator = require('../util/schemaValidator')
const mongoose = require('mongoose')
const Product = mongoose.model('Product')

const schema = {
    params: Joi.object().keys({
        id: Joi.number().integer().min(10000000).max(99999999).required()
    }),
    body: Joi.object().keys({
        value: Joi.number().precision(2).strict().positive().required(),
        currency_code: Joi.string().required()
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
 *         name: current_price
 *         type: object
 *         properties:
 *           value:
 *             type: float
 *             example: 1234.56
 *             required: true
 *           currency_code:
 *             type: string
 *             example: 'USD'
 *             required: true
 *     responses:
 *       '200':
 *         description: Product upserted in db
 *         schema:
 *           $ref: '#/definitions/Product'
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Problem communicating with db
 */
module.exports = router =>
    router.put('/products/:id', schemaValidator(schema), async (req, res) => {
        try {
            let {id, current_price} = await Product.findOneAndUpdate({id: req.params.id}, {current_price: req.body}, {
                new: true, runValidators: true, upsert: true
            })
            console.log(`Update successful: ${id}`)
            res.json({id, current_price})
        } catch (error) {
            console.error(error)
            res.status(500).json({error: 'An error occured, contact administrator'})
        }
    })
