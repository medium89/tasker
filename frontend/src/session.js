import { ref } from 'vue'
export const me = ref(null)

export async function loadMe() {
  try {
    const res = await fetch('/user', {
      credentials: 'include',
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
    })
    me.value = res.ok ? await res.json() : null
  } catch {
    me.value = null
  }
}
