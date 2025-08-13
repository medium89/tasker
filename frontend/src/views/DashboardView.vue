<template>
  <div class="dashboard">
    <h2 class="dashboard__title">Доска</h2>

    <p v-if="loading" class="dashboard__loading">Загрузка...</p>

    <form @submit.prevent="addTask" class="dashboard__form">
      <input
        v-model="newTask.title"
        class="form-control dashboard__input dashboard__input--title"
        placeholder="Название задачи"
        required
      />
      <input
        v-model="newTask.description"
        class="form-control dashboard__input dashboard__input--description"
        placeholder="Описание"
      />
      <select v-model="newTask.status" class="form-select dashboard__select dashboard__select--status" required>
        <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <select v-model="newTask.priority" class="form-select dashboard__select dashboard__select--priority" required>
        <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <input type="date" v-model="newTask.due_date" class="form-control dashboard__input dashboard__input--date" />
      <button type="submit" :disabled="loading" class="btn btn-success dashboard__button dashboard__button--add">
        {{ loading ? 'Загрузка…' : 'Добавить' }}
      </button>
    </form>

    <p v-if="error" class="dashboard__error">{{ error }}</p>

    <div class="dashboard__tasks">
      <div v-for="task in tasks" :key="task.id" class="dashboard__task">
        <div v-if="!task.editing" class="dashboard__task-view">
          <div class="dashboard__task-title">{{ task.title }}</div>
          <div class="dashboard__task-description">{{ task.description }}</div>
          <div class="dashboard__task-status">{{ statusLabel(task.status) }}</div>
          <div class="dashboard__task-priority">{{ priorityLabel(task.priority) }}</div>
          <div class="dashboard__task-date">{{ task.due_date }}</div>
        </div>
        <div v-else class="dashboard__task-edit">
          <div class="dashboard__task-title">
            <input v-model="task.title" class="form-control dashboard__input dashboard__input--title" />
          </div>
          <div class="dashboard__task-description">
            <input v-model="task.description" class="form-control dashboard__input dashboard__input--description" />
          </div>
          <div class="dashboard__task-status">
            <select v-model="task.status" class="form-select dashboard__select dashboard__select--status">
              <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div class="dashboard__task-priority">
            <select v-model="task.priority" class="form-select dashboard__select dashboard__select--priority">
              <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div class="dashboard__task-date">
            <input type="date" v-model="task.due_date" class="form-control dashboard__input dashboard__input--date" />
          </div>
        </div>

        <div class="dashboard__tasks__actios">
          <button
            v-if="!task.editing"
            @click="task.editing = true"
            :disabled="loading"
            class="btn btn-secondary dashboard__button dashboard__button--edit"
          >
            Редактировать
          </button>
          <button
            v-else
            @click="updateTask(task)"
            :disabled="loading"
            class="btn btn-primary dashboard__button dashboard__button--save"
          >
            Сохранить
          </button>
          <button
            @click="deleteTask(task.id)"
            :disabled="loading"
            class="btn btn-danger dashboard__button dashboard__button--delete"
          >
            Удалить
          </button>
        </div>  
      </div>
    </div>
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
  if (!confirm('Вы уверены, что хотите удалить задачу?')) return
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

