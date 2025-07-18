<template>
  <div class="register-wrapper">
    <h2>📝 Intern Kayıt Formu</h2>
    <form @submit.prevent="onSubmit">
      <div class="field">
        <label>Ad:</label>
        <input v-model="form.name" required />
      </div>

      <div class="field">
        <label>Soyad:</label>
        <input v-model="form.surname" required />
      </div>

      <div class="field">
        <label>Üniversite:</label>
        <input v-model="form.university" required />
      </div>

      <div class="field">
        <label>Bölüm:</label>
        <input v-model="form.department" required />
      </div>

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
  university: '',
  department: '',
});

async function onSubmit() {
  const account = instance.getActiveAccount();
  if (!account) return;

  try {
    await api.post('/interns', {
      ...form,
      email: account.username,
      role: 'Intern',
    });
    // Kayıt tamamlandı, Home sayfasına dön
    router.replace({ name: 'Home' });
  } catch (err) {
    console.error('Intern kayıt hatası:', err);
  }
}
</script>

<style scoped>
.register-wrapper {
  max-width: 480px;
  margin: 60px auto;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.field {
  margin-bottom: 16px;
}
label {
  display: block;
  font-weight: 500;
  margin-bottom: 4px;
}
input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  background: #242441;
  color: #fff;
  cursor: pointer;
}
button:hover {
  background: #1e1e3f;
}
</style>
