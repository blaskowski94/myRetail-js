const controller = require('../controllers/myRetailController')

module.exports = app => {
    app.route('/products/:id').get(controller.getProduct).put(controller.updateProduct).delete(controller.deleteProduct)

    app.route('/products').get(controller.listProducts).post(controller.createProduct)
}
