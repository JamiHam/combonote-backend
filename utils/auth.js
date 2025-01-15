const jwt = require('jsonwebtoken')

const authorization = (request, response, next) => {
  const authorization = request.get('authorization')
  
  if (authorization && authorization.startsWith('Bearer ')) {
    try {
      const token = authorization.replace('Bearer ', '')
      request.decodedToken = jwt.verify(token, process.env.SECRET)
    } catch (error) {
      return next(error)
    }
  } else {
    return response.status(401).json({ error: 'missing token' })
  }

  next()
}

module.exports = { authorization }