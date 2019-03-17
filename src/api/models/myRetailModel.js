const mongoose = require('mongoose')
const {Schema} = mongoose

const ProductSchema = new Schema({
    productId: {
        type: Number,
        unique: true,
        required: '8 digit number',
        min: 10000000,
        max: 99999999
    },
    price: {
        type: String,
        required: '$1,000.00 format',
        match: /^\$?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$/
    },
})

module.exports = mongoose.model('Product', ProductSchema)
