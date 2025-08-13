<template>
  <div>
    <h2>Все задачи</h2>

    <p v-if="loading">Загрузка...</p>

    <form @submit.prevent="addTask">
      <input v-model="newTask.title" placeholder="Название задачи" required />
      <input v-model="newTask.description" placeholder="Описание" />
      <select v-model="newTask.status" required>
        <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <select v-model="newTask.priority" required>
        <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <input type="date" v-model="newTask.due_date" />
      <button type="submit" :disabled="loading">{{ loading ? 'Загрузка…' : 'Добавить' }}</button>
    </form>

    <p v-if="error">{{ error }}</p>

    <ul>
      <li v-for="task in tasks" :key="task.id">
        <span v-if="!task.editing">
          {{ task.title }} — {{ task.description }} —
          {{ statusLabel(task.status) }} —
          {{ priorityLabel(task.priority) }} — {{ task.due_date }}
        </span>
        <span v-else>
          <input v-model="task.title" />
          <input v-model="task.description" />
          <select v-model="task.status">
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <select v-model="task.priority">
            <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <input type="date" v-model="task.due_date" />
        </span>

        <button v-if="!task.editing" @click="task.editing = true" :disabled="loading">✏️</button>
        <button v-else @click="updateTask(task)" :disabled="loading">💾</button>
        <button @click="deleteTask(task.id)" :disabled="loading">🗑</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios' // твой файл с конфигом axios

const tasks = ref([])
const statusOptions = [
  { value: 'backlog', label: 'Бэклог' },
  { value: 'todo', label: 'К выполнению' },
  { value: 'doing', label: 'В работе' },
  { value: 'done', label: 'Сделано' },
]
const priorityOptions = [
  { value: 'low', label: 'Низкий' },
  { value: 'normal', label: 'Обычный' },
  { value: 'high', label: 'Высокий' },
  { value: 'urgent', label: 'Срочный' },
]
const statusLabel = value => {
  const opt = statusOptions.find(o => o.value === value)
  return opt ? opt.label : value
}
const priorityLabel = value => {
  const opt = priorityOptions.find(o => o.value === value)
  return opt ? opt.label : value
}
const newTask = ref({
  title: '',
  description: '',
  status: 'backlog',
  priority: 'normal',
  due_date: '',
})
const error = ref('')
const loading = ref(false)

async function fetchTasks() {
  error.value = ''
  loading.value = true
  try {
    const { data } = await axios.get('/api/tasks')
    tasks.value = data.map(t => ({ ...t, due_date: t.due_date || '', editing: false }))
  } catch (e) {
    console.error(e)
    error.value = 'Не удалось загрузить задачи'
  } finally {
    loading.value = false
  }
}

async function addTask() {
  error.value = ''
  loading.value = true
  try {
    const payload = {
      title: newTask.value.title,
      description: newTask.value.description,
      status: newTask.value.status,
      priority: newTask.value.priority,
      due_date: newTask.value.due_date || null,
    }
    const { data } = await axios.post('/api/tasks', payload)
    tasks.value.push({ ...data, due_date: data.due_date || '', editing: false })
    newTask.value = {
      title: '',
      description: '',
      status: 'backlog',
      priority: 'normal',
      due_date: '',
    }
  } catch (e) {
    console.error(e)
    error.value = 'Не удалось добавить задачу'
  } finally {
    loading.value = false
  }
}

async function updateTask(task) {
  error.value = ''
  loading.value = true
  try {
    const { data } = await axios.put(`/api/tasks/${task.id}`, {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date || null,
    })
    Object.assign(task, data, {
      editing: false,
      due_date: data.due_date || '',
    })
  } catch (e) {
    console.error(e)
    error.value = 'Не удалось обновить задачу'
  } finally {
    loading.value = false
  }
}

async function deleteTask(id) {
  error.value = ''
  loading.value = true
  try {
    await axios.delete(`/api/tasks/${id}`)
    tasks.value = tasks.value.filter(t => t.id !== id)
  } catch (e) {
    console.error(e)
    error.value = 'Не удалось удалить задачу'
  } finally {
    loading.value = false
  }
}

onMounted(fetchTasks)
</script>

