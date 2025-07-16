<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getInternsWithAuth } from '@/utils/apiClients';

// ✨ Burada tip tanımlıyoruz
interface Intern {
  id: number;
  name: string;
  // email?: string;
}

const interns = ref<Intern[]>([]);

onMounted(async () => {
  try {
    interns.value = await getInternsWithAuth();
  } catch (error) {
    console.error('Stajyerleri alırken hata:', error);
  }
});
</script>

<template>
  <div>
    <h2>Stajyerler</h2>
    <ul>
      <li v-for="intern in interns" :key="intern.id">
        {{ intern.name }}
      </li>
    </ul>
  </div>
</template>
