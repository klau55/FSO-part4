const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../../app')
const Blog = require('../../models/blog')
const api = supertest(app)
const helper = require('../list_helper.js')
const User = require('../../models/user.js')
const bcrypt = require('bcryptjs')


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



test('id exists', async() => {

  const response =  await api.get('/api/blogs')
  response.body.forEach(blog => expect(blog.id).toBeDefined())
})
test('a valid blog can be added', async() => {


  const newBlog = {

    title: "Test",
    author: "Test Test",
    url: "www..test",
    likes: 0,
    user: "root"
}

await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)

const response = await api.get('/api/blogs')

expect(response.body).toHaveLength(initialBlogs.length + 1)
})


describe('deletion of a blog', () => {
   test('succeeds with status code 204 if id is valid', async () => {
    const response = await api.get('/api/blogs')

    await api
      .delete(`/api/blogs/${response.body.find(blog => blog.id).id}`)
      .expect(204)
    
    
  const response_after_delete = await api.get('/api/blogs')
  expect(response_after_delete.body).toHaveLength(initialBlogs.length-1)
    
   })
})
describe('editing of a blog', () => {
  test('blog can be edited', async() => {
    const response = await api.get('/api/blogs')
    const initialBlog = response.body.find(blog => blog.id)
    const changedBlog = {
      title: initialBlog.title,
      author: initialBlog.author,
      url: initialBlog.url,
      likes: 999
    }

    await api
      .put(`/api/blogs/${initialBlog.id}`)
      .send(changedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    expect(changedBlog.likes).toBe(999)
  
  })


})
describe('user manipulations', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'red', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})




afterAll(async () => {
  await mongoose.connection.close()
})