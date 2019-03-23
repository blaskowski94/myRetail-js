const mongoose = require('mongoose')
const Product = mongoose.model('Product')
const _ = require('lodash')

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     name: List Product
 *     summary: List products in database
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: An array of product objects
 *       '500':
 *         description: Problem communicating with db
 */
module.exports = router =>
    router.get('/products', async (req, res) => {
        try {
            const list = await Product.find({})
            console.log('GET successful: list')
            res.json(_.orderBy(_.map(list, item => _.pick(item, ['id', 'current_price'])), ['id']))
        } catch (error) {
            console.error(error)
            res.status(500).json({error: 'An error occured, contact administrator'})
        }
    })

