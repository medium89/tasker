<!-- ProfileView.vue -->
<template>
    <section style="max-width: 600px; margin: 32px auto; padding: 16px;">
      <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 16px;">Профиль</h1>
  
    <div v-if="loading">Загрузка профиля…</div>
    <div v-else>
      <div v-if="error" style="color:#d00; margin-bottom:8px;">{{ error }}</div>
      <div v-if="user">
        <form @submit.prevent="onSave" style="margin-bottom:8px;">
          <div style="margin-bottom:8px;">
            <label>
              Имя:
              <input v-model="form.name" type="text" />
            </label>
          </div>
          <div style="margin-bottom:8px;">
            <label>
              Email:
              <input v-model="form.email" type="email" />
            </label>
          </div>
          <button type="submit" :disabled="saving">{{ saving ? 'Загрузка…' : 'Сохранить' }}</button>
        </form>
        <p><strong>Создан:</strong> {{ new Date(user.created_at).toLocaleString() }}</p>
        <button @click="onDelete" :disabled="deleting" style="margin-top:16px;color:#d00">{{ deleting ? 'Загрузка…' : 'Удалить аккаунт' }}</button>
      </div>
    </div>
    </section>
    </template>

    <script setup>
    import { ref, reactive, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { fetchUser, updateUser, deleteUser } from '@/auth'

    const router = useRouter()
    const user = ref(null)
    const form = reactive({ name: '', email: '' })
    const loading = ref(true)
    const saving = ref(false)
    const deleting = ref(false)
    const error = ref('')

    onMounted(async () => {
      try {
        user.value = await fetchUser()
        if (user.value) {
          form.name = user.value.name
          form.email = user.value.email
        }
      } catch (e) {
        error.value = e?.message || 'Не удалось загрузить профиль'
      } finally {
        loading.value = false
      }
    })

    async function onSave() {
      saving.value = true
      try {
        const updated = await updateUser({ name: form.name, email: form.email })
        user.value = updated
        error.value = ''
      } catch (e) {
        error.value = e?.message || 'Не удалось обновить профиль'
      } finally {
        saving.value = false
      }
    }

    async function onDelete() {
      if (!confirm('Вы уверены, что хотите удалить аккаунт?')) return
      deleting.value = true
      try {
        await deleteUser()
        router.push('/login')
      } catch (e) {
        error.value = e?.message || 'Не удалось удалить аккаунт'
      } finally {
        deleting.value = false
      }
    }
    </script>
  