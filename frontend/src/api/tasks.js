export async function fetchTasks() {
    const res = await fetch('/tasks', {
      credentials: 'include',
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
    })
    if (!res.ok) throw new Error('Не удалось получить задачи')
    return res.json()
  }