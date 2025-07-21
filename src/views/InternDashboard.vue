<template>
  <div class="dashboard-grid">
    <DashboardCard title="Assignment Durumu">
      <PieChart :data="assignmentStats" />
    </DashboardCard>

    <DashboardCard title="To-Do List">
      <div class="scroll-box">
        <ul>
          <li
            v-for="item in todoList"
            :key="item.id"
            class="flex items-center justify-between mb-1"
          >
            <div>
              <input
                type="checkbox"
                :checked="item.done"
                @change="toggleDone(item)"
              />
              <span
                :class="{
                  'line-through text-gray-400': item.done,
                  'ml-2': true,
                }"
              >
                {{ item.task }}
              </span>
            </div>
            <button @click="deleteTask(item.id)" class="text-red-500 text-sm">
              🗑
            </button>
          </li>
        </ul>
      </div>
      <div class="input-bottom">
        <input
          v-model="newTask"
          @keyup.enter="addTask"
          placeholder="Yeni görev ekle..."
          class="border p-1 w-full rounded text-sm"
        />
      </div>
    </DashboardCard>

    <DashboardCard title="Önemli Maddeler">
      <div class="scroll-box">
        <ul class="list-disc pl-4 text-sm">
          <li
            v-for="note in notes"
            :key="note.id"
            class="flex justify-between items-center mb-1"
          >
            {{ note.content }}
            <button
              @click="deleteNote(note.id)"
              class="text-red-500 text-xs ml-2"
            >
              🗑
            </button>
          </li>
        </ul>
      </div>
      <div class="input-bottom">
        <input
          v-model="newNote"
          @keyup.enter="addNote"
          placeholder="Yeni madde ekle..."
          class="border p-1 w-full rounded text-sm"
        />
      </div>
    </DashboardCard>

    <DashboardCard title=" ">
      <p class="text-sm"></p>
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

onMounted(async () => {
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
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  height: 80vh;
  box-sizing: border-box;
  padding: 20px;
  font-size: 12px;
}

.card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  overflow: hidden;
  height: 100%;
}

.scroll-box {
  flex-grow: 1;
  overflow-y: auto;
  border: 1px solid black;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 8px;
}

.input-bottom {
  margin-top: auto;
}
</style>
