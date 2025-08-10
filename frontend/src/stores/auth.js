import { reactive } from 'vue'

export const auth = reactive({
  user: null,
  async fetchUser() {
    try {
      const res = await fetch('/user', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      })
      if (res.ok) {
        this.user = await res.json()
      } else {
        this.user = null
      }
    } catch {
      this.user = null
    }
  },
  logout() {
    this.user = null
  }
})
