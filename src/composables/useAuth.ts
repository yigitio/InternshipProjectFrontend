// src/composables/useAuth.ts
import { useMsal } from 'vue3-msal-plugin';
import { useRouter } from 'vue-router';
import api from '@/utils/apiClients';

export function useAuth() {
  const { instance } = useMsal();
  const router = useRouter();

  async function handlePostLogin() {
    const account = instance.getActiveAccount();
    if (!account) return;

    const email = account.username;
    const role = (account.idTokenClaims as any).role as string;

    // 1. Eğer Intern ise...
    if (role === 'Intern') {
      const { data: exists } = await api.get<boolean>(`/interns/exists`, {
        params: { email },
      });
      if (!exists) {
        await api.post(`/interns`, { email, role });
        return router.replace('/register/intern');
      }
      return router.replace('/home');
    }

    // 2. Değilse (not-intern)…
    const { data: exists } = await api.get<boolean>(`/mentors/exists`, {
      params: { email },
    });
    if (!exists) {
      // /register/not-intern diye bir form sayfan var ise onu kullan,
      // yoksa MentorForm’u da kullanabilirsin:
      return router.replace('/register/not-intern');
    }
    return router.replace('/home');
  }

  return { handlePostLogin };
}
