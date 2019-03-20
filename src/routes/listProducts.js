const mongoose = require('mongoose')
const Product = mongoose.model('Product')

module.exports = router => {
    router.get('/products', async (req, res) => {
        try {
            const list = await Product.find({})
            console.log('GET successful: list')
            res.json(list)
        } catch (error) {
            console.error(error)
            res.status(500).send('An error occured, contact administrator')
        }
    })
}
