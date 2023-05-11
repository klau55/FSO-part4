const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../../app')
const Blog = require('../../models/blog')
const api = supertest(app)



const initialBlogs = [


  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  }]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})


test('all blogs are returned', async () => {
  
  const response =  await api.get('/api/blogs')
  const initialBlogs = response.body
  expect(response.body).toHaveLength(initialBlogs.length)

}, 100000)

test('a specific blog in returned blogs', async () => {
  
  const response =  await api.get('/api/blogs')
  const authors = response.body.map(r => r.author)
  expect(authors).toContain ('Michael Chan')

}, 100000)

afterAll(async () => {
  await mongoose.connection.close()
})

test('id exists', async() => {

  const response =  await api.get('/api/blogs')
  response.body.forEach(blog => expect(blog.id).toBeDefined())
})
test('a valid blog can be added', async() => {


  const newBlog = {

    title: "Test",
    author: "Test Test",
    url: "www..test",
    likes: 0
}

await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)

const response = await api.get('/api/blogs')

expect(response.body).toHaveLength(initialBlogs.length + 1)
})