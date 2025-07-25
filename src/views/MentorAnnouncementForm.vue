<template>
  <div class="form-container">
    <h2>Duyuru Ekle</h2>
    <input v-model="title" placeholder="Başlık" class="input" />
    <textarea v-model="content" placeholder="İçerik" class="textarea" />
    <button @click="submitAnnouncement" class="submit-btn">Kaydet</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const title = ref('');
const content = ref('');

const submitAnnouncement = async () => {
  if (!title.value || !content.value) {
    alert('Lütfen başlık ve içerik girin.');
    return;
  }

  await axios.post('http://localhost:8080/api/announcements', {
    title: title.value,
    content: content.value,
  });

  alert('Duyuru eklendi!');
  title.value = '';
  content.value = '';
};
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.input,
.textarea {
  padding: 10px;
  width: 100%;
}
.submit-btn {
  padding: 10px;
  background-color: #242444;
  color: white;
}
</style>
