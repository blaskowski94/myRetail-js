const mongoose = require('mongoose')
const {Schema} = mongoose

/* eslint-disable indent */
/**
 * @swagger
 * definitions:
 *   Product:
 *     type: object
 *     properties:
 *       productId:
 *         type: integer
 *         example: 12345678
 *         required: true
 *         minimum: 10000000
 *         maximum: 99999999
 *       price:
 *         type: string
 *         example: $1,234.56
 *         required: true
 */
const ProductModel = new Schema({
    productId: {
        type: Number,
        unique: true,
        required: '8 digit number',
        min: 10000000,
        max: 99999999,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value'
        }
    },
    price: {
        type: String,
        required: '$1,000.00 format',
        match: /^\$?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$/
    }
})

module.exports = mongoose.model('Product', ProductModel)
