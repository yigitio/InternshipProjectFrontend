<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { addAssignment, updateAssignment } from "@/utils/assignmentService";

const interns = ref<{ id: number; name: string }[]>([]);
const mentors = ref<{ id: number; name: string }[]>([]);

// Form verileri
const form = ref({
  internId: 0,
  mentorId: 0,
  assignmentName: "",
  assignmentDesc: "",
  dueDate: "",
  priority: "",
  assignedAt: "",
  completedAt: "",
});

// Sayfa yüklendiğinde intern ve mentorları çek
onMounted(async () => {
  const internRes = await axios.get("http://localhost:8080/api/interns");
  interns.value = internRes.data.map((i: any) => ({
    id: i.id,
    name: i.name + " " + i.surname,
  }));

  const mentorRes = await axios.get("http://localhost:8080/api/mentors");
  mentors.value = mentorRes.data.map((m: any) => ({
    id: m.id,
    name: m.name + " " + m.surname,
  }));
});

// Yeni görev ekle
const submitAssignment = async () => {
  try {
    await addAssignment(form.value);
    alert("Görev başarıyla eklendi!");
  } catch (err) {
    console.error(err);
    alert("Görev eklenirken hata oluştu.");
  }
};
</script>

<template>
  <div>
    <h2>Yeni Görev Ekle</h2>
    <form @submit.prevent="submitAssignment">
      <label>Stajyer:</label>
      <select v-model="form.internId">
        <option value="">Seçiniz</option>
        <option v-for="intern in interns" :key="intern.id" :value="intern.id">
          {{ intern.name }}
        </option>
      </select>

      <label>Mentor:</label>
      <select v-model="form.mentorId">
        <option value="">Seçiniz</option>
        <option v-for="mentor in mentors" :key="mentor.id" :value="mentor.id">
          {{ mentor.name }}
        </option>
      </select>

      <label>Görev Adı:</label>
      <input v-model="form.assignmentName" type="text" required />

      <label>Açıklama:</label>
      <textarea v-model="form.assignmentDesc"></textarea>

      <label>Öncelik:</label>
      <input v-model="form.priority" type="text" />

      <label>Başlama Tarihi:</label>
      <input v-model="form.assignedAt" type="date" />

      <label>Bitiş Tarihi:</label>
      <input v-model="form.dueDate" type="date" />

      <label>Tamamlama Tarihi:</label>
      <input v-model="form.completedAt" type="date" />

      <button type="submit">Görev Ekle</button>
    </form>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  max-width: 400px;
}
</style>
