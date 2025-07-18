<template>
  <div class="register-wrapper">
    <h2>📝 Kayıt Formu (Intern Değilsin)</h2>
    <form @submit.prevent="onSubmit">
      <div class="field">
        <label>Ad:</label>
        <input v-model="form.name" required />
      </div>
      <div class="field">
        <label>Soyad:</label>
        <input v-model="form.surname" required />
      </div>
      <!-- İhtiyacın olan ek alanlar buraya -->
      <button type="submit">Kaydı Tamamla</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useMsal } from 'vue3-msal-plugin';
import { useRouter } from 'vue-router';
import api from '@/utils/apiClients';

const { instance } = useMsal();
const router = useRouter();

const form = reactive({
  name: '',
  surname: '',
  // gerekiyorsa daha fazla alan ekle
});

async function onSubmit() {
  const account = instance.getActiveAccount();
  if (!account) return;
  const email = account.username;
  try {
    // Not-intern kaydını mentor endpoint’ine de yazabilirsin,
    // veya ayrı bir endpoint’in varsa onu kullan
    await api.post('/mentors', { ...form, email, role: 'NotIntern' });
    router.replace({ name: 'Home' });
  } catch (e) {
    console.error('NotIntern kayıt hatası:', e);
  }
}
</script>
