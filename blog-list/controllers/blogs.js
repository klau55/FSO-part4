const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
    })


blogsRouter.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
  } catch(exception) {
    next(exception)    
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})
blogsRouter.put('/:id', async (request, response, next) => {


  
  try{
    const body = request.body
    const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(updatedBlog) 
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter