import axios from 'axios'

// Use API URL from Vite env or fall back to same origin.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''
axios.defaults.withCredentials = true

export default axios
