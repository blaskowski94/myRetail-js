const schemaValidator = require('../schemaValidator')
const Joi = require('joi')

const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
}

it('should validate a single key schema with one param with success', async () => {
    const schema = {
        body: Joi.object().keys({
            body1: Joi.number().valid(1).required()
        })
    }
    let req = {
        body: {
            body1: 1
        }
    }
    const res = mockResponse()
    const next = jest.fn()

    await schemaValidator(schema)(req, res, next)

    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(req.validated).toEqual({
        body: {
            body1: 1
        },
        headers: {},
        params: {},
        query: {}
    })
    expect(next).toHaveBeenCalled()
})

it('should validate a single key schema with one param with error', async () => {
    const schema = {
        body: Joi.object().keys({
            body1: Joi.number().valid(1).required()
        })
    }
    let req = {
        body: {
            body1: 2
        }
    }
    const res = mockResponse()
    const next = jest.fn()

    await schemaValidator(schema)(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(['"body1" must be one of [1]'])
    expect(next).not.toHaveBeenCalled()
})

it('should validate a single key schema with multiple params with success', async () => {
    const schema = {
        body: Joi.object().keys({
            body1: Joi.number().valid(1).required(),
            body2: Joi.number().valid(2).required()
        })
    }
    let req = {
        body: {
            body1: 1,
            body2: 2
        }
    }
    const next = jest.fn()
    const res = mockResponse()

    await schemaValidator(schema)(req, res, next)

    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(req.validated).toEqual({
        body: {
            body1: 1,
            body2: 2
        },
        headers: {},
        params: {},
        query: {}
    })
    expect(next).toHaveBeenCalled()
})

it('should validate a single key schema with multiple params with error', async () => {
    const schema = {
        body: Joi.object().keys({
            body1: Joi.number().valid(1).required(),
            body2: Joi.number().valid(2).required()
        })
    }
    let req = {
        body: {
            body1: 1,
            body2: 3
        }
    }
    const next = jest.fn()
    const res = mockResponse()

    await schemaValidator(schema)(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(['"body2" must be one of [2]'])
    expect(next).not.toHaveBeenCalled()
})

it('should validate a multiple key schema with multiple params with success', async () => {
    const schema = {
        headers: Joi.object().keys({
            header1: Joi.number().valid(1).required(),
            header2: Joi.number().valid(2).required()
        }),
        params: Joi.object().keys({
            param1: Joi.number().valid(3).required(),
            param2: Joi.number().valid(4).required()
        }),
        query: Joi.object().keys({
            query1: Joi.number().valid(5).required(),
            query2: Joi.number().valid(6).required()
        }),
        body: Joi.object().keys({
            body1: Joi.number().valid(7).required(),
            body2: Joi.number().valid(8).required()
        })
    }
    const next = jest.fn()
    let req = {
        headers: {
            header1: 1,
            header2: 2
        },
        params: {
            param1: 3,
            param2: 4
        },
        query: {
            query1: 5,
            query2: 6
        },
        body: {
            body1: 7,
            body2: 8
        }
    }
    const res = mockResponse()

    await schemaValidator(schema)(req, res, next)

    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(req.validated).toEqual({
        headers: {
            header1: 1,
            header2: 2
        },
        params: {
            param1: 3,
            param2: 4
        },
        query: {
            query1: 5,
            query2: 6
        },
        body: {
            body1: 7,
            body2: 8
        }
    })
    expect(next).toHaveBeenCalled()
})

it('should validate a multiple key schema with multiple params with error', async () => {
    const schema = {
        headers: Joi.object().keys({
            header1: Joi.number().valid(1).required(),
            header2: Joi.number().valid(2).required()
        }),
        params: Joi.object().keys({
            param1: Joi.number().valid(3).required(),
            param2: Joi.number().valid(4).required()
        }),
        query: Joi.object().keys({
            query1: Joi.number().valid(5).required(),
            query2: Joi.number().valid(6).required()
        }),
        body: Joi.object().keys({
            body1: Joi.number().valid(7).required(),
            body2: Joi.number().valid(8).required()
        })
    }
    const next = jest.fn()
    let req = {
        headers: {
            header1: 1,
            header2: 3
        },
        params: {
            param1: 3,
            param2: 5
        },
        query: {
            query1: 5,
            query2: 7
        },
        body: {
            body1: 7,
            body2: 9
        }
    }
    const res = mockResponse()

    await schemaValidator(schema)(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(['"header2" must be one of [2]'])
    expect(next).not.toHaveBeenCalled()
})
