<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '@/utils/apiClients'; // Your configured axios instance

interface Faq {
  id: number;
  question: string;
  answer: string;
}

const faqs = ref<Faq[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Hangi sorunun açık olduğunu tutmak için bir değişken
const activeQuestionId = ref<number | null>(null);

// Bir soruya tıklandığında çalışacak fonksiyon
const toggleQuestion = (id: number) => {
  // Eğer zaten açık olan soruya tekrar tıklandıysa, kapat
  if (activeQuestionId.value === id) {
    activeQuestionId.value = null;
  } else {
    // Değilse, tıklanan soruyu aktif hale getir
    activeQuestionId.value = id;
  }
};

onMounted(async () => {
  try {
    const response = await apiClient.get('/api/faqs');
    faqs.value = response.data;
  } catch (err) {
    error.value = 'Sorular yüklenirken bir hata oluştu.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="faq-container">
    <h2 class="title">Sıkça Sorulan Sorular</h2>

    <div v-if="isLoading">Yükleniyor...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else class="faq-list">
      <div v-for="faq in faqs" :key="faq.id" class="faq-item">
        <button
          class="question"
          :class="{ active: activeQuestionId === faq.id }"
          @click="toggleQuestion(faq.id)"
        >
          <span>{{ faq.question }}</span>
          <span class="arrow">›</span>
        </button>
        <div
          class="answer-container"
          :class="{ open: activeQuestionId === faq.id }"
        >
          <div class="answer-content">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.faq-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: sans-serif;
}

.title {
  text-align: center;
  margin-bottom: 2.5rem;
  color: #242441;
}

.faq-item {
  border-bottom: 1px solid #e0e0e0;
}

.question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.5rem 1rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 1.1rem;
  color: #242441;
  transition: background-color 0.2s ease;
}

.question:hover {
  background-color: #f9f9f9;
}

.question.active {
  color: #f58220;
}

.arrow {
  font-size: 1.8rem;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.question.active .arrow {
  transform: rotate(90deg);
}

/* Cevabın açılıp kapanma animasyonu için */
.answer-container {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease-in-out;
}

.answer-container.open {
  max-height: 500px; /* Cevabınızın sığacağı bir yükseklik */
}

.answer-content {
  padding: 0 1rem 1.5rem 1rem;
  color: #555;
  line-height: 1.6;
}
</style>
