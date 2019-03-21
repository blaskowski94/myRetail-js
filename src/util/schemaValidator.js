// TODO: return all validation errors at once instaed of one at a time
module.exports = routeSchema => (req, res, next) => {
    const validations = ['headers', 'params', 'query', 'body']
        .map(key => {
            const schema = routeSchema[key]
            const value = req[key]
            const validate = () => schema ? schema.validate(value) : Promise.resolve({})
            return validate().then(result => ({[key]: result}))
        })
    return Promise.all(validations)
        .then(result => {
            req.validated = Object.assign({}, ...result)
            next()
        })
        .catch(validationError => {
            console.error(validationError)
            const message = validationError.details.map(d => d.message)
            res.status(400).json(message)
        })
}
