<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Task {
  id: number
  title: string
  status: 'todo' | 'in-progress' | 'complete'
}

const tasks = ref<Task[]>([])
const newTodoTask = ref('')
const newInProgressTask = ref('')
const newCompleteTask = ref('')

const addTask = (title: string, status: 'todo' | 'in-progress' | 'complete') => {
  if (!title.trim()) return
  const taskId = tasks.value.length ? tasks.value[tasks.value.length - 1].id + 1 : 1
  const data = { id: taskId, title: title.trim(), status }
  tasks.value.unshift(data)
  localStorage.tasks = JSON.stringify(tasks.value)
}

const updateTask = (id: number, status: 'todo' | 'in-progress' | 'complete') => {
  const task = tasks.value.find((t) => t.id === id)
  if (task) {
    task.status = status
    localStorage.tasks = JSON.stringify(tasks.value)
  }
}

const removeTask = (id: number) => {
  tasks.value.splice(
    tasks.value.findIndex((task) => task.id === id),
    1,
  )
  localStorage.tasks = JSON.stringify(tasks.value)
}

const onDragStart = (event: DragEvent, taskId: number) => {
  event.dataTransfer?.setData('text/plain', String(taskId))
}

const onDrop = (event: DragEvent, status: 'todo' | 'in-progress' | 'complete') => {
  const taskId = Number(event.dataTransfer?.getData('text/plain'))
  if (taskId) {
    updateTask(taskId, status)
  }
}

onMounted(() => {
  const storedTasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : []
  tasks.value = storedTasks
})
</script>
<template>
  <div class="task-app-container">
    <div class="task-app">
      <h2><i class="fas fa-tasks"></i> Задачи</h2>
      <div class="input-container">
        <input
          v-model="newTodoTask"
          placeholder="Добавить задачу"
          @keyup.enter="
            addTask(newTodoTask, 'todo')
            newTodoTask = ''
          "
        />
        <i
          @click="
            addTask(newTodoTask, 'todo')
            newTodoTask = ''
          "
          class="fas fa-plus primary-icon"
        ></i>
      </div>
      <div class="task-sections" @drop.prevent="onDrop($event, 'todo')" @dragover.prevent>
        <div class="task-section">
          <h3>Задачи</h3>
          <ul class="task-list">
            <li
              v-for="task in tasks.filter((t) => t.status === 'todo')"
              :key="task.id"
              class="task-item todo"
              draggable="true"
              @dragstart="onDragStart($event, task.id)"
            >
              <span class="task-text">{{ task.title }}</span>
              <div class="task-actions">
                <i
                  @click="updateTask(task.id, 'in-progress')"
                  class="fas fa-arrow-right small-btn success-btn"
                ></i>
                <button @click="removeTask(task.id)" class="delete-btn">Удалить</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="task-app">
      <h2><i class="fas fa-spinner"></i> В процессе</h2>
      <div class="input-container">
        <input
          v-model="newInProgressTask"
          placeholder="Добавить задачу"
          @keyup.enter="
            addTask(newInProgressTask, 'in-progress')
            newInProgressTask = ''
          "
        />
        <i
          @click="
            addTask(newInProgressTask, 'in-progress')
            newInProgressTask = ''
          "
          class="fas fa-plus primary-icon"
        ></i>
      </div>
      <div class="task-sections" @drop.prevent="onDrop($event, 'in-progress')" @dragover.prevent>
        <div class="task-section">
          <h3>В процессе</h3>
          <ul class="task-list">
            <li
              v-for="task in tasks.filter((t) => t.status === 'in-progress')"
              :key="task.id"
              class="task-item in-progress"
              draggable="true"
              @dragstart="onDragStart($event, task.id)"
            >
              <span class="task-text">{{ task.title }}</span>
              <div class="task-actions">
                <i
                  @click="updateTask(task.id, 'complete')"
                  class="fas fa-check small-btn success-btn"
                ></i>
                <button @click="removeTask(task.id)" class="delete-btn">Удалить</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="task-app">
      <h2><i class="fas fa-check-circle"></i> Выполненные</h2>
      <div class="input-container">
        <input
          v-model="newCompleteTask"
          placeholder="Добавить задачу"
          @keyup.enter="
            addTask(newCompleteTask, 'complete')
            newCompleteTask = ''
          "
        />
        <i
          @click="
            addTask(newCompleteTask, 'complete')
            newCompleteTask = ''
          "
          class="fas fa-plus primary-icon"
        ></i>
      </div>
      <div class="task-sections" @drop.prevent="onDrop($event, 'complete')" @dragover.prevent>
        <div class="task-section">
          <h3>Выполненные</h3>
          <ul class="task-list">
            <li
              v-for="task in tasks.filter((t) => t.status === 'complete')"
              :key="task.id"
              class="task-item complete"
              draggable="true"
              @dragstart="onDragStart($event, task.id)"
            >
              <span class="task-text">{{ task.title }}</span>
              <div class="task-actions">
                <i
                  @click="updateTask(task.id, 'in-progress')"
                  class="fas fa-arrow-left small-btn secondary-btn"
                ></i>
                <button @click="removeTask(task.id)" class="delete-btn">Удалить</button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: #f0f4f8;
  font-family: 'Roboto', Arial, sans-serif;
}

.task-app-container {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.task-app {
  max-width: 400px;
  padding: 20px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0px 4px 20px rgba(0,0,0,0.1);
}

.task-app h2 {
  text-align: center;
  color: #333;
}

.input-container {
  display: flex;
}

input {
  flex-grow: 1;
  padding: 12px;
  border-radius: 5px;
  border: none;
}

input::placeholder {
   color: #aaa;
}

.primary-icon {
   cursor: pointer;
   font-size: 24px;
   color: #007bff;
   margin-left: -40px;
}
.primary-icon:hover {
   color: #0056b3;
}

.small-btn {
   cursor: pointer;
   font-size: 18px;
   margin-left:10px;
}

.delete-btn {
   background-color: #ff4d4d;
   color: white;
   border: none;
   border-radius: 5px;
   padding: 5px 10px;
   cursor: pointer;
   transition: background-color .3s ease, transform .2s ease;
}

.delete-btn:hover {
   background-color: #e63946;
   transform: scale(1.05); /
}

.task-list {
   list-style-type: none;
   padding-left:0;
}

.task-item {
   display:flex;
   justify-content: space-between;
   align-items:center;
   padding:10px;
   margin-bottom:10px;
   border-radius:5px;
   transition:.3s ease-in-out;
}

.task-item.todo {
   background-color:#e7f1ff;
}
.task-item.in-progress {
   background-color:#e6f7ff;
}
.task-item.complete {
   background-color:#d4edda;
}
.task-item:hover {
   background-color:#f0f0f0;
}
.task-text {
   color:#333;
}
.task-actions i:hover {
   color:#ff4d4d;
}


.task-item-leave-active {
    transition: opacity .5s ease;
}
.task-item-leave-to {
    opacity: 0;
}
</style>
