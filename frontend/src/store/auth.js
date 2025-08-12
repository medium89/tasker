// src/store/auth.js
import { reactive } from 'vue'
import axios from 'axios'

export const auth = reactive({
  user: null,

  async getUser() {
    try {
      const res = await axios.get('/user')
      this.user = res.data
    } catch {
      this.user = null
    }
  },

  async logout() {
    await axios.post('/logout')
    this.user = null
  }
})
