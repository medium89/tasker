<template>
  <div>
    <h2>Все задачи</h2>

    <form @submit.prevent="addTask">
      <input v-model="newTask.title" placeholder="Название задачи" required />
      <input v-model="newTask.description" placeholder="Описание" />
      <button type="submit">Добавить</button>
    </form>

    <ul>
      <li v-for="task in tasks" :key="task.id">
        <span v-if="!task.editing">{{ task.title }} — {{ task.description }}</span>
        <span v-else>
          <input v-model="task.title" />
          <input v-model="task.description" />
        </span>

        <button v-if="!task.editing" @click="task.editing = true">✏️</button>
        <button v-else @click="updateTask(task)">💾</button>
        <button @click="deleteTask(task.id)">🗑</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios' // твой файл с конфигом axios

const tasks = ref([])
const newTask = ref({ title: '', description: '' })

async function fetchTasks() {
  const { data } = await axios.get('/api/tasks')
  tasks.value = data.map(t => ({ ...t, editing: false }))
}

async function addTask() {
  const { data } = await axios.post('/api/tasks', newTask.value)
  tasks.value.push({ ...data, editing: false })
  newTask.value = { title: '', description: '' }
}

async function updateTask(task) {
  const { data } = await axios.put(`/api/tasks/${task.id}`, {
    title: task.title,
    description: task.description
  })
  Object.assign(task, data, { editing: false })
}

async function deleteTask(id) {
  await axios.delete(`/api/tasks/${id}`)
  tasks.value = tasks.value.filter(t => t.id !== id)
}

onMounted(fetchTasks)
</script>
