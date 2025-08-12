// src/auth.js
// Авторизация через Laravel Sanctum (session cookies + CSRF)

function getCookie(name) {
  const m = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  )
  return m ? decodeURIComponent(m[1]) : ''
}

async function getCsrf() {
  await fetch('/sanctum/csrf-cookie', {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
}

export async function fetchUser() {
  const res = await fetch('/api/user', {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  if (res.status === 401) return null
  if (!res.ok) throw new Error('Не удалось получить пользователя')
  return res.json()
}

export async function updateUser(data) {
  const xsrf = getCookie('XSRF-TOKEN')
  const res = await fetch('/user', {
    method: 'PUT',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': xsrf,
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Не удалось обновить профиль')
  }
  return res.json()
}

export async function login(email, password) {
  await getCsrf()
  const xsrf = getCookie('XSRF-TOKEN')

  const res = await fetch('/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': xsrf,
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Неверный логин или пароль')
  }
  return fetchUser()
}

export async function logout() {
  const xsrf = getCookie('XSRF-TOKEN')

  const res = await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-XSRF-TOKEN': xsrf,
    },
  })
  if (!res.ok) throw new Error('Не удалось выйти')
}

export async function deleteUser() {
  const xsrf = getCookie('XSRF-TOKEN')
  const res = await fetch('/user', {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-XSRF-TOKEN': xsrf,
    },
  })
  if (!res.ok) throw new Error('Не удалось удалить аккаунт')
}
