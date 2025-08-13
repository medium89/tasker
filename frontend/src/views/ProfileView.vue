<!-- ProfileView.vue -->
<template>
  <section
    style="max-width: 600px; margin: 32px auto; padding: 16px;"
    class="profile"
  >
    <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 16px;" class="profile__title">
      Профиль
    </h1>

    <div v-if="loading" class="profile__loading">Загрузка профиля…</div>
    <div v-else>
      <div v-if="error" style="color:#d00; margin-bottom:8px;" class="profile__error">{{ error }}</div>
      <div v-if="user" class="profile__content">
        <form @submit.prevent="onSave" style="margin-bottom:8px;" class="profile__form">
          <div style="margin-bottom:8px;" class="profile__field">
            <label class="profile__label">
              Имя:
              <input v-model="form.name" type="text" class="profile__input" />
            </label>
          </div>
          <div style="margin-bottom:8px;" class="profile__field">
            <label class="profile__label">
              Email:
              <input v-model="form.email" type="email" class="profile__input" />
            </label>
          </div>
          <button type="submit" :disabled="saving" class="profile__save">
            {{ saving ? 'Загрузка…' : 'Сохранить' }}
          </button>
        </form>

        <form @submit.prevent="onSavePassword" style="margin-bottom:8px;" class="profile__password-form">
          <div style="margin-bottom:8px;" class="profile__field">
            <label class="profile__label">
              Пароль:
              <input v-model="passwordForm.password" type="password" class="profile__input" />
            </label>
          </div>
          <div style="margin-bottom:8px;" class="profile__field">
            <label class="profile__label">
              Подтверждение пароля:
              <input v-model="passwordForm.passwordConfirmation" type="password" class="profile__input" />
            </label>
          </div>
          <button type="submit" :disabled="savingPassword" class="profile__password-save">
            {{ savingPassword ? 'Загрузка…' : 'Обновить пароль' }}
          </button>
        </form>

        <p class="profile__created">
          <strong>Создан:</strong> {{ new Date(user.created_at).toLocaleString() }}
        </p>
        <button
          @click="onDelete"
          :disabled="deleting"
          style="margin-top:16px;color:#d00"
          class="profile__delete"
        >
          {{ deleting ? 'Загрузка…' : 'Удалить аккаунт' }}
        </button>
      </div>
    </div>
  </section>
</template>

    <script setup>
      import { ref, reactive, onMounted } from 'vue'
      import { useRouter } from 'vue-router'
      import { fetchUser, updateUser, updatePassword, deleteUser } from '@/auth'

    const router = useRouter()
    const user = ref(null)
      const form = reactive({ name: '', email: '' })
      const passwordForm = reactive({ password: '', passwordConfirmation: '' })
      const loading = ref(true)
      const saving = ref(false)
      const savingPassword = ref(false)
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

      async function onSavePassword() {
        savingPassword.value = true
        try {
          await updatePassword(passwordForm.password, passwordForm.passwordConfirmation)
          passwordForm.password = ''
          passwordForm.passwordConfirmation = ''
          error.value = ''
        } catch (e) {
          error.value = e?.message || 'Не удалось обновить пароль'
        } finally {
          savingPassword.value = false
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
  