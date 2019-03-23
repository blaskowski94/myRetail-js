const mongoose = require('mongoose')
const {Schema} = mongoose

/* eslint-disable indent */
/**
 * @swagger
 * definitions:
 *   Product:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         example: 12345678
 *         required: true
 *         minimum: 10000000
 *         maximum: 99999999
 *       current_price:
 *         type: object
 *         required: true
 *         properties:
 *           value:
 *             type: float
 *             example: 1234.56
 *             required: true
 *           currency_code:
 *             type: string
 *             example: 'USD'
 *             required: true
 */
const ProductModel = new Schema({
    id: {
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
    current_price: {
        value: {
            type: Number,
            required: true
        },
        currency_code: {
            type: String,
            required: true
        }
    }
})

module.exports = mongoose.model('Product', ProductModel)
