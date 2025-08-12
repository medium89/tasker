import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import router from '../router'
import { auth } from '../store/auth.js'

describe('App', () => {
  it('renders routed view under navbar', async () => {
    vi.spyOn(auth, 'getUser').mockResolvedValue()

    router.push('/auth')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.find('h1').text()).toBe('Вход')
  })
})

