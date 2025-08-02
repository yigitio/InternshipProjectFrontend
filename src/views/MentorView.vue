<template>
  <div class="register-wrapper">
    <h2>📝 {{ $t('mentorView.title') }}</h2>
    <form @submit.prevent="onSubmit">
      <div class="field">
        <label>{{ $t('mentorView.name') }}:</label>
        <input v-model="form.name" required />
      </div>

      <div class="field">
        <label>{{ $t('mentorView.surname') }}:</label>
        <input v-model="form.surname" required />
      </div>

      <div class="field">
        <label>{{ $t('mentorView.expertise') }}:</label>
        <input v-model="form.expertise" required />
      </div>

      <button type="submit">{{ $t('mentorView.submit') }}</button>
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
  expertise: '',
});

async function onSubmit() {
  const account = instance.getActiveAccount();
  if (!account) return;

  try {
    await api.post('/api/mentors', {
      ...form,
      email: account.username,
      role: 'Mentor',
    });
    router.replace({ name: 'Home' });
  } catch (err) {
    console.error('Mentor kayıt hatası:', err);
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
