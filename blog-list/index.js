require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)


mongoose.connect(url)
	.then(result => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)
  console.log("body",request.body)

  blog
    .save()
    .then(result => {
      console.log(result)
      response.status(201).json(result)
    })
})

 PORT = '3003'
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})