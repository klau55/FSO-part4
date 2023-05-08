const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

        return blogs.reduce((n, blog) => Number(n) + Number(blog.likes), 0)
}



module.exports = {
  dummy, totalLikes
}

