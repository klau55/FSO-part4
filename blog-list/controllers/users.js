const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs')

  response.json(users)
})

usersRouter.post('/', async (request, response) => {

const { username, name, password } = request.body
console.log(username, name, password)
const saltRounds = 10
const passwordHash = await bcrypt.hash(password, saltRounds)

const user = new User({
    username,
    name,
    passwordHash,
  })
console.log(user)

const savedUser = await user.save()

response.status(201).json(savedUser)
})

module.exports = usersRouter