const Joi = require('joi')
const schemaValidator = require('../util/schemaValidator')
const mongoose = require('mongoose')
const Product = mongoose.model('Product')

const schema = {
    params: Joi.object().keys({
        id: Joi.number().integer().min(10000000).max(99999999).required()
    })
}

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     name: Delete Product
 *     summary: Delete product from database
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id of product to be deleted
 *         type: integer
 *         required: true
 *     responses:
 *       '204':
 *         description: Product deleted from db
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Problem communicating with db
 */
module.exports = router =>
    router.delete('/products/:id', schemaValidator(schema), async (req, res) => {
        try {
            const productId = req.params.id
            await Product.deleteOne({productId})
            console.log(`DELETE successful: ${productId}`)
            res.status(204).send()
        } catch (error) {
            console.error(error)
            res.status(500).json({error: 'An error occured, contact administrator'})
        }
    })

