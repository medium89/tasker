<!-- ProfileView.vue -->
<template>
  <section class="profile">
    <h1 class="profile__title">Профиль</h1>

    <div v-if="loading" class="profile__loading">Загрузка профиля…</div>
    <div v-else>
      <div v-if="error" class="profile__error">{{ error }}</div>
      <div v-if="user" class="profile__content">
        <form @submit.prevent="onSave" class="profile__form profile__form--info">
          <div class="profile__field">
            <label class="form-label">
              Имя:
              <input v-model="form.name" type="text" class="form-control profile__input profile__input--name" />
            </label>
          </div>
          <div class="profile__field">
            <label class="form-label">
              Email:
              <input v-model="form.email" type="email" class="form-control profile__input profile__input--email" />
            </label>
          </div>
          <button
            type="submit"
            :disabled="saving"
            class="btn btn-primary profile__button profile__button--save"
          >
            {{ saving ? 'Загрузка…' : 'Сохранить' }}
          </button>
        </form>

        <form @submit.prevent="onSavePassword" class="profile__form profile__form--password">
          <div class="profile__field">
            <label class="form-label">
              Пароль:
              <input
                v-model="passwordForm.password"
                type="password"
                class="form-control profile__input profile__input--password"
              />
            </label>
          </div>
          <div class="profile__field">
            <label class="form-label">
              Подтверждение пароля:
              <input
                v-model="passwordForm.passwordConfirmation"
                type="password"
                class="form-control profile__input profile__input--password-confirmation"
              />
            </label>
          </div>
          <button
            type="submit"
            :disabled="savingPassword"
            class="btn btn-warning profile__button profile__button--update-password"
          >
            {{ savingPassword ? 'Загрузка…' : 'Обновить пароль' }}
          </button>
        </form>

        <p class="profile__created">
          <strong>Создан:</strong> {{ new Date(user.created_at).toLocaleString() }}
        </p>
        <button
          @click="onDelete"
          :disabled="deleting"
          class="btn btn-danger profile__button profile__button--delete"
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
        if (
          !confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')
        )
          return
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
  