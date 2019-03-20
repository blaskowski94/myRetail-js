const Joi = require('joi')
const schemaValidator = require('../util/schemaValidator')
const mongoose = require('mongoose')
const Product = mongoose.model('Product')

const schema = {
    params: Joi.object().keys({
        id: Joi.number().integer().min(10000000).max(99999999).required()
    })
}

module.exports = router => {
    router.delete('/products/:id', schemaValidator(schema), async (req, res) => {
        try {
            const productId = req.params.id
            await Product.deleteOne({productId})
            console.log(`DELETE successful: ${productId}`)
            res.status(204).send()
        } catch (error) {
            console.error(error)
            res.status(500).send('An error occured, contact administrator')
        }
    })
}
