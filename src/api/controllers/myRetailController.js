const mongoose = require('mongoose')
const fetch = require('node-fetch')
const _ = require('lodash')

Product = mongoose.model('Product')
apiUrl = productId => `https://redsky.target.com/v2/pdp/tcin/${productId}?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics,esp,deep_red_labels,available_to_promise_network`

// TODO: params validation, error handling, valid http response codes

const listProducts = async (req, res) => {
    try {
        const list = await Product.find({})
        console.log('GET successful: list')
        res.json(list)
    } catch (error) {
        console.error(error)
        res.send(error)
    }
}

const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body)
        const product = await newProduct.save()
        console.log(`POST successful: ${product.productId}`)
        res.json(product)
    } catch (error) {
        console.error(error)
        res.send(error)
    }
}

const getProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const apiProduct = await (await fetch(apiUrl(productId))).json()
        const productName = _.get(apiProduct, 'product.item.product_description.title', 'Unavailable')

        const dbProduct = await Product.findOne({productId})
        const productPrice = _.get(dbProduct, 'price', 'Unavailable')
        
        console.log(`GET successful: {productName: ${productName}, productPrice: ${productPrice}}`)
        res.json({productId, productName, productPrice})
    } catch (error) {
        console.error(error)
        res.send(error)
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        let response = await Product.findOneAndUpdate({productId}, req.body, {
            new: true, runValidators: true
        })
        console.log(`Update successful: ${productId}`)
        res.json(response)
    } catch (error) {
        console.error(error)
        res.send(error)
    }
}

const deleteProduct = async (req, res) => {
    const productId = req.params.id
    await Product.deleteOne({
        productId
    }, (err) => {
        if (err) res.send(err)
        const message = `DELETE successful: ${productId}`
        console.log(message)
        res.json({message})
    })
}

module.exports = {listProducts, createProduct, getProduct, deleteProduct, updateProduct}
