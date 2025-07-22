<template>
  <div class="dashboard-grid">
    <DashboardCard title="Assignment Durumu">
      <PieChart :data="assignmentStats" />
    </DashboardCard>

    <DashboardCard title="To-Do List">
      <div class="scroll-box">
        <ul v-if="todoList.length">
          <li v-for="item in todoList" :key="item.id" class="task-item">
            <label class="task-label">
              <input
                type="checkbox"
                :checked="item.done"
                @change="toggleDone(item)"
                class="task-checkbox"
              />
              <span :class="{ 'task-done': item.done }">
                {{ item.task }}
              </span>
            </label>
            <button @click="deleteTask(item.id)" class="task-delete">🗑</button>
          </li>
        </ul>
        <p v-else class="empty-text">Henüz görev eklenmemiş.</p>
      </div>
      <div class="input-bottom">
        <input
          v-model="newTask"
          @keyup.enter="addTask"
          placeholder="Yeni görev ekle..."
          class="input-field"
        />
      </div>
    </DashboardCard>

    <DashboardCard title="Önemli Maddeler">
      <div class="scroll-box">
        <ul v-if="notes.length">
          <li v-for="note in notes" :key="note.id" class="task-item">
            <span>{{ note.content }}</span>
            <button @click="deleteNote(note.id)" class="task-delete">🗑</button>
          </li>
        </ul>
        <p v-else class="empty-text">Henüz madde eklenmemiş.</p>
      </div>
      <div class="input-bottom">
        <input
          v-model="newNote"
          @keyup.enter="addNote"
          placeholder="Yeni madde ekle..."
          class="input-field"
        />
      </div>
    </DashboardCard>

    <DashboardCard title=" ">
      <div class="greeting-box">{{ greetingMessage }}</div>
    </DashboardCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useMsal } from 'vue3-msal-plugin';
import PieChart from '@/components/PieChart.vue';
import DashboardCard from '@/components/DashboardCard.vue';

interface TodoItem {
  id: number;
  task: string;
  done: boolean;
  internEmail: string;
}

interface NoteItem {
  id: number;
  content: string;
  internEmail: string;
}

const { accounts } = useMsal();
const email = accounts.value[0].username;

const assignmentStats = ref<{ name: string; value: number }[]>([]);
const greetingMessage = ref('');

onMounted(async () => {
  const hour = new Date().getHours();
  if (hour < 12) greetingMessage.value = 'Günaydın!';
  else if (hour < 18) greetingMessage.value = 'İyi günler!';
  else greetingMessage.value = 'İyi akşamlar!';

  try {
    const res = await axios.get('http://localhost:8080/api/assignments/stats');
    assignmentStats.value = Object.entries(res.data).map(([name, value]) => ({
      name,
      value: Number(value),
    }));
  } catch (err) {
    console.error('Assignment stats alınamadı:', err);
  }

  try {
    const res = await axios.get(
      `http://localhost:8080/api/todos/byEmail/${email}`
    );
    todoList.value = res.data;
  } catch (err) {
    console.error('To-do list alınamadı:', err);
  }

  try {
    const res = await axios.get(`http://localhost:8080/api/notes/${email}`);
    notes.value = res.data;
  } catch (err) {
    console.error('Notlar alınamadı:', err);
  }
});

const todoList = ref<TodoItem[]>([]);
const newTask = ref('');

const addTask = async () => {
  if (!newTask.value.trim()) return;
  const res = await axios.post('http://localhost:8080/api/todos', {
    task: newTask.value,
    done: false,
    internEmail: email,
  });
  todoList.value.push(res.data);
  newTask.value = '';
};

const deleteTask = async (id: number) => {
  await axios.delete(`http://localhost:8080/api/todos/${id}`);
  todoList.value = todoList.value.filter(t => t.id !== id);
};

const toggleDone = async (item: TodoItem) => {
  await axios.put(`http://localhost:8080/api/todos/${item.id}`, {
    ...item,
    done: !item.done,
  });
  item.done = !item.done;
};

const notes = ref<NoteItem[]>([]);
const newNote = ref('');

const addNote = async () => {
  if (!newNote.value.trim()) return;
  const res = await axios.post('http://localhost:8080/api/notes', {
    content: newNote.value,
    internEmail: email,
  });
  notes.value.push(res.data);
  newNote.value = '';
};

const deleteNote = async (id: number) => {
  await axios.delete(`http://localhost:8080/api/notes/${id}`);
  notes.value = notes.value.filter(n => n.id !== id);
};
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr); /* her satır eşit yüksek */
  gap: 12px;
  padding: 12px;
  max-width: 900px; /* tüm dashboard'ı daraltır */
  margin: 0 auto; /* ortalar */
  height: calc(100vh - 140px); /* scroll olmadan sığar */
  box-sizing: border-box;
}

/* Her DashboardCard bileşeni */
.card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 12px;
  height: 100%; /* grid hücresinin tamamını kapla */
  display: flex;
  flex-direction: column;
}

/* Responsive: 768px altı ekranlarda kartlar alt alta */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    height: auto;
  }
}

/* Listeyi ve inputu birlikte kapsayan kutu */
.scroll-box {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 6px;
  margin-bottom: 0;
  max-height: 180px;
}

/* Input alanları */
.input-field {
  width: 96%;
  padding: 6px 8px;
  font-size: 13px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  margin-top: 6px;
  transition: border-color 0.2s ease;
}

.input-field:focus {
  border-color: #3b82f6;
}

/* Görev/madde öğeleri */
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 6px 10px;
  margin-bottom: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.task-item:hover {
  background-color: #f0f0f0;
}

.task-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-checkbox {
  width: 14px;
  height: 14px;
  cursor: pointer;
}

.task-done {
  text-decoration: line-through;
  color: #999;
}

.task-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #d11a2a;
}

.empty-text {
  text-align: center;
  color: #999;
  font-size: 13px;
  margin: 10px 0;
}

/* Selamlama kartı */
.greeting-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}
</style>
