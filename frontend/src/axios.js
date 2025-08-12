import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080' // Laravel backend
axios.defaults.withCredentials = true

export default axios
