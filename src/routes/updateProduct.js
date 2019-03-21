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
