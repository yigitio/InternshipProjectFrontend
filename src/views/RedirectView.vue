<script setup lang="ts">
import { useMsal } from 'vue3-msal-plugin';
import { useRouter } from 'vue-router';
import api from '@/utils/apiClients';
import { onMounted } from 'vue';

const { instance } = useMsal();
const router = useRouter();

onMounted(async () => {
  const account = instance.getActiveAccount();
  if (!account) return;

  // Azure profilinden title ve email al
  const title = account.idTokenClaims?.title;
  const email = account.username;

  let endpoint = '';
  if (typeof title === 'string' && title.toLowerCase() === 'intern') {
    endpoint = `/interns/exists?email=${encodeURIComponent(email)}`;
  } else {
    endpoint = `/mentors/exists?email=${encodeURIComponent(email)}`;
  }

  try {
    const res = await api.get(endpoint);
    if (res.data === true) {
      router.replace({ name: 'Home' });
    } else {
      router.replace({ name: 'CreateAccount' });
    }
  } catch (e) {
    router.replace({ name: 'CreateAccount' });
  }
});
</script>

<template>
  <div>Yönlendiriliyorsunuz...</div>
</template>
