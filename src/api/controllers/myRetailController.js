const mongoose = require('mongoose')
const fetch = require('node-fetch')

Product = mongoose.model('Product')

const listProducts = (req, res) => {
    Product.find({}, (err, product) => {
        if (err) res.send(err)
        console.log('GET successful')
        res.json(product)
    })
}

const createProduct = async (req, res) => {
    const newProduct = new Product(req.body)
    await newProduct.save((err, product) => {
        if (err) res.send(err)
        console.log(`POST successful: ${product.productId}`)
        res.json(product)
    })
}

const getProduct = async (req, res) => {
    const productId = req.params.id
    const response = await (await fetch(`https://redsky.target.com/v2/pdp/tcin/${productId}`)).json()
    //console.log(response)
    Product.findOne({productId: req.params.id}, (err, product) => {
        if (err) res.send(err)
        console.log(`GET successful: ${product.productId}`)
        res.json(product)
    })
}

const updateProduct = (req, res) => {
    Product.findOneAndUpdate({productId: req.params.id}, req.body, {
        new: true, runValidators: true
    }, (err, product) => {
        if (err) res.send(err)
        console.log(`PUT successful: ${product.productId}`)
        res.json(product)
    })
}

const deleteProduct = async (req, res) => {
    await Product.deleteOne({
        productId: req.params.id
    }, (err) => {
        if (err) res.send(err)
        const message = 'DELETE successful'
        console.log(message)
        res.json({message})
    })
}

module.exports = {listProducts, createProduct, getProduct, deleteProduct, updateProduct}


