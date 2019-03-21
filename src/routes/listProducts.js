const mongoose = require('mongoose')
const Product = mongoose.model('Product')
const _ = require('lodash')

module.exports = router =>
    router.get('/products', async (req, res) => {
        try {
            const list = await Product.find({})
            console.log('GET successful: list')
            res.json(_.orderBy(_.map(list, item => _.pick(item, ['productId', 'price'])), ['productId']))
        } catch (error) {
            console.error(error)
            res.status(500).json({error: 'An error occured, contact administrator'})
        }
    })

