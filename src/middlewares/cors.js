import cors from 'cors'

const ALLOWED_ORIGIN = ['http://localhost:3000', 'http://localhost:8000']

const custom = cors({
  origin: (origin, callback) => {
    console.log(origin)
    if (ALLOWED_ORIGIN.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('The origin not allowed by CORS'))
    }
  }
})

export default custom
