import axios from 'axios'

const ncHttpApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NOCODB_URL || 'http://localhost:8080',
  headers: {
    'xc-token': process.env.NEXT_PUBLIC_NOCODB_API_TOKEN,
  },
})

export default ncHttpApi
