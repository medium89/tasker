<template>
  <div class="dashboard">
    <h2 class="dashboard__title">Все задачи</h2>

    <p v-if="loading" class="dashboard__loading">Загрузка...</p>

    <form @submit.prevent="addTask" class="task-form">
      <input
        v-model="newTask.title"
        placeholder="Название задачи"
        required
        class="task-form__title"
      />
      <input
        v-model="newTask.description"
        placeholder="Описание"
        class="task-form__description"
      />
      <select v-model="newTask.status" required class="task-form__status">
        <option value="backlog">backlog</option>
        <option value="todo">todo</option>
        <option value="doing">doing</option>
        <option value="done">done</option>
      </select>
      <select v-model="newTask.priority" required class="task-form__priority">
        <option value="low">low</option>
        <option value="normal">normal</option>
        <option value="high">high</option>
        <option value="urgent">urgent</option>
      </select>
      <input type="date" v-model="newTask.due_date" class="task-form__due-date" />
      <button type="submit" :disabled="loading" class="task-form__submit">
        {{ loading ? 'Загрузка…' : 'Добавить' }}
      </button>
    </form>

    <p v-if="error" class="dashboard__error error">{{ error }}</p>

    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id" class="task-item">
        <span v-if="!task.editing" class="task-item__text">
          {{ task.title }} — {{ task.description }} — {{ task.status }} —
          {{ task.priority }} — {{ task.due_date }}
        </span>
        <span v-else class="task-item__edit-fields">
          <input v-model="task.title" class="task-item__title" />
          <input v-model="task.description" class="task-item__description" />
          <select v-model="task.status" class="task-item__status">
            <option value="backlog">backlog</option>
            <option value="todo">todo</option>
            <option value="doing">doing</option>
            <option value="done">done</option>
          </select>
          <select v-model="task.priority" class="task-item__priority">
            <option value="low">low</option>
            <option value="normal">normal</option>
            <option value="high">high</option>
            <option value="urgent">urgent</option>
          </select>
          <input type="date" v-model="task.due_date" class="task-item__due-date" />
        </span>

        <button
          v-if="!task.editing"
          @click="task.editing = true"
          :disabled="loading"
          class="task-item__edit"
        >Редактировать</button>
        <button
          v-else
          @click="updateTask(task)"
          :disabled="loading"
          class="task-item__save"
        >💾</button>
        <button
          @click="deleteTask(task.id)"
          :disabled="loading"
          class="task-item__delete"
        >Удалить</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios' // твой файл с конфигом axios

const tasks = ref([])
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

<style>
.error {
  color: #d00;
}
</style>
