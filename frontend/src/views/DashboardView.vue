<script setup>
import { ref, onMounted } from 'vue'

const tasks = ref([])
const error = ref(null)
const loading = ref(false)
const newTaskTitle = ref('')
const newTaskDescription = ref('')
const editingTask = ref(null) // хранит редактируемую задачу

// Загрузка моих задач
async function loadTasks() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('/dashboard', {
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
    if (!res.ok) throw new Error('Ошибка загрузки задач')
    tasks.value = await res.json()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// Добавить задачу
async function addTask() {
  if (!newTaskTitle.value.trim()) return
  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        title: newTaskTitle.value,
        description: newTaskDescription.value
      })
    })
    if (!res.ok) throw new Error('Ошибка добавления')
    newTaskTitle.value = ''
    newTaskDescription.value = ''
    await loadTasks()
  } catch (e) {
    alert(e.message)
  }
}

// Начать редактирование
function startEdit(task) {
  editingTask.value = { ...task }
}

// Сохранить изменения
async function updateTask() {
  try {
    const res = await fetch(`/api/tasks/${editingTask.value.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        title: editingTask.value.title,
        description: editingTask.value.description
      })
    })
    if (!res.ok) throw new Error('Ошибка обновления')
    editingTask.value = null
    await loadTasks()
  } catch (e) {
    alert(e.message)
  }
}

// Удалить задачу
async function deleteTask(id) {
  if (!confirm('Удалить задачу?')) return
  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
    if (!res.ok) throw new Error('Ошибка удаления')
    await loadTasks()
  } catch (e) {
    alert(e.message)
  }
}

onMounted(loadTasks)
</script>

<template>
  <div>
    <h2>Мои задачи</h2>

    <p v-if="error" style="color:red">{{ error }}</p>
    <p v-if="loading">Загрузка...</p>

    <!-- Форма добавления -->
    <div style="margin-bottom: 20px">
      <input v-model="newTaskTitle" placeholder="Название" />
      <input v-model="newTaskDescription" placeholder="Описание" />
      <button @click="addTask">Добавить</button>
    </div>

    <!-- Список задач -->
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <div v-if="editingTask && editingTask.id === task.id">
          <input v-model="editingTask.title" />
          <input v-model="editingTask.description" />
          <button @click="updateTask">Сохранить</button>
          <button @click="editingTask = null">Отмена</button>
        </div>
        <div v-else>
          <strong>{{ task.title }}</strong> — {{ task.description }}
          <button @click="startEdit(task)">Редактировать</button>
          <button @click="deleteTask(task.id)">Удалить</button>
        </div>
      </li>
    </ul>
  </div>
</template>
