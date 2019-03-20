const Joi = require('joi')
const schemaValidator = require('../util/schemaValidator')
const mongoose = require('mongoose')
Product = mongoose.model('Product')

const schema = {
    params: Joi.object().keys({
        id: Joi.number().integer().min(10000000).max(99999999).required()
    }),
    body: Joi.object().keys({
        price: Joi.string().regex(/^\$?[0-9]{1,3}(?:,?[0-9]{3})*\.[0-9]{2}$/, 'US dollar, $1,000.00 format').required()
    })
}

module.exports = router => {
    router.put('/products/:id', schemaValidator(schema), async (req, res) => {
        try {
            const productId = req.params.id
            let response = await Product.findOneAndUpdate({productId}, req.body, {
                new: true, runValidators: true, upsert: true
            })
            console.log(`Update successful: ${productId}`)
            res.json(response)
        } catch (error) {
            console.error(error)
            res.status(500).send('An error occured, contact administrator')
        }
    })
}
