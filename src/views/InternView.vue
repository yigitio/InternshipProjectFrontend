<template>
  <div class="register-bg">
    <div class="register-card">
      <img src="@/assets/etiya-logo.png" alt="Etiya" class="form-logo" />
      <div class="welcome-text">HOŞGELDİN ETİYALI!</div>
      <h2>Intern Kayıt Formu</h2>
      <form @submit.prevent="onSubmit">
        <div class="field">
          <label>Ad:</label>
          <input v-model="form.name" required placeholder="Adınızı giriniz" />
        </div>
        <div class="field">
          <label>Soyad:</label>
          <input
            v-model="form.surname"
            required
            placeholder="Soyadınızı giriniz"
          />
        </div>
        <div class="field">
          <label>Üniversite:</label>
          <input
            v-model="form.university"
            required
            placeholder="Üniversitenizi giriniz"
          />
        </div>
        <div class="field">
          <label>Bölüm:</label>
          <input
            v-model="form.department"
            required
            placeholder="Bölümünüzü giriniz"
          />
        </div>
        <div class="field">
          <label>Email:</label>
          <input v-model="form.email" type="email" readonly />
        </div>
        <div class="field">
          <label>Telefon:</label>
          <input
            v-model="form.phone"
            type="tel"
            required
            placeholder="05xx xxx xx xx"
          />
        </div>
        <button type="submit">Kaydı Tamamla</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
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
  email: '',
  phone: '',
});

onMounted(() => {
  const account = instance.getActiveAccount();
  if (account) {
    form.email = account.username;
  }
});

async function onSubmit() {
  const account = instance.getActiveAccount();
  if (!account) return router.replace({ name: 'Login' });

  try {
    await api.post('/interns', {
      name: form.name,
      surname: form.surname,
      university: form.university,
      department: form.department,
      email: form.email,
      phoneNumber: form.phone, // <-- BE, DTO'daki alan ile uyumlu olmalı!
      role: 'Intern',
    });
    alert('Stajyer kaydın başarıyla alındı!');
    router.replace({ name: 'Home' });
  } catch (e) {
    console.error('Intern kayıt hatası:', e);
    alert('Kayıtta hata oluştu.');
  }
}
</script>

<style scoped>
/* MentorView ile aynı CSS'yi kullanabilirsin */
.register-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eaf0fd 0%, #f3f6fd 100%);
  position: relative;
  overflow: hidden;
}
.register-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('@/assets/etiya-logo.png') repeat;
  background-size: 150px auto;
  opacity: 0.09;
  pointer-events: none;
  z-index: 0;
}
.register-card {
  position: relative;
  z-index: 2;
  width: 420px;
  background: #fff;
  border-radius: 26px;
  box-shadow: 0 6px 32px 0 rgba(32, 42, 68, 0.14);
  padding: 44px 36px 38px 36px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form-logo {
  width: 64px;
  margin-bottom: 14px;
  margin-top: -8px;
}
.welcome-text {
  margin-bottom: 22px;
  font-size: 2.1rem;
  font-weight: 900;
  color: #3251d4;
  letter-spacing: 1px;
  text-shadow: 0 2px 12px #b3c6ff33;
}
h2 {
  color: #222c51;
  font-size: 1.32rem;
  font-weight: 700;
  margin-bottom: 34px;
  margin-top: -8px;
  letter-spacing: 0.2px;
}
.field {
  width: 100%;
  margin-bottom: 19px;
  text-align: left;
}
label {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: #3654b7;
  display: block;
  letter-spacing: 0.1px;
}
input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #d4e2fa;
  border-radius: 10px;
  margin-top: 5px;
  font-size: 1.07rem;
  background: #f4f8ff;
  color: #223152;
  font-weight: 500;
  transition: border 0.17s;
  outline: none;
}
input:focus {
  border: 2px solid #3d5ae6;
  background: #fff;
}
button[type='submit'] {
  width: 100%;
  background: linear-gradient(90deg, #3865ec 60%, #203884 100%);
  color: #fff;
  font-size: 1.15rem;
  font-weight: 800;
  border: none;
  border-radius: 11px;
  padding: 14px 0;
  margin-top: 16px;
  box-shadow: 0 2px 14px #a5bbf366;
  cursor: pointer;
  letter-spacing: 0.2px;
  transition: background 0.2s;
}
button[type='submit']:hover {
  background: linear-gradient(90deg, #1a2857 40%, #3865ec 100%);
}
</style>
