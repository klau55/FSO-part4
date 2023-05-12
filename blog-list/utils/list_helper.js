const blog = require("../models/blog")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

        return blogs.reduce((n, blog) => Number(n) + Number(blog.likes), 0)
}


const favoriteBlog = (blogs) => {
    
    const fav = blogs.reduce((res,blog) =>Number(res.likes) < Number(blog.likes) ?  blog.likes : res
    , blogs[0])
    
    return fav
}
const blogsInDb = async() => {

  const blogs = await blog.find({})
  return blogs.map(blog => blog.toJSON())

}

module.exports = {
  dummy, totalLikes, favoriteBlog, blogsInDb
}

