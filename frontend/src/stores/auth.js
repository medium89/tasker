// src/auth.js
import { reactive, computed } from 'vue'

export const auth = reactive({
  user: null,
  async fetchUser() {
    try {
      const res = await fetch('/user', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      })
      this.user = res.ok ? await res.json() : null
    } catch {
      this.user = null
    }
  },
  logout() { this.user = null }
})

export const isAuthenticated = computed(() => !!auth.user)
export const userName = computed(() => auth.user?.name || '')
