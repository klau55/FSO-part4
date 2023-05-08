const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    console.log("AAAAAAAAAAAA")
    Blog.find({}).then(blogs => {
        response.json(blogs)
    })
    })


blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)
  console.log("body",request.body)

  blog
    .save()
    .then(result => {
      console.log(result)
      response.status(201).json(result)
    })
})


module.exports = blogsRouter