const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../../app')
const Blog = require('../../models/blog')
const api = supertest(app)

const initialBlogs = [
{
  title: 'Zebra',
  author: 'Arti Hellas',
  url: 'www.040',
  likes: 0
},
{
  title: 'Goose',
  author: 'Lora Palmer',
  url: 'www.041',
  likes: 0
},
]

/*beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})
*/


test('all blogs are returned', async () => {
  
  const response =  await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)

}, 100000)

test('a specific blog in returned blogs', async () => {
  
  const response =  await api.get('/api/blogs')
  const authors = response.body.map(r => r.author)
  expect(authors).toContain ('Arti Hellas')

}, 100000)

afterAll(async () => {
  await mongoose.connection.close()
})

test('id exists', async() => {

  const response =  await api.get('/api/blogs')
  response.body.forEach(blog => expect(blog.id).toBeDefined())
})