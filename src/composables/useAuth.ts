// src/composables/useAuth.ts
import { useMsal } from 'vue3-msal-plugin';
import { useRouter } from 'vue-router';

export function useAuth() {
  const { instance } = useMsal();
  const router = useRouter();

  /**
   * Login başarılı olduğunda çağrılacak.
   * Bizi /register rotasına fırlatır; orada
   * intern/mentor kontrolü, kayıt akışı tetiklenecek.
   */
  async function handlePostLogin() {
    const account = instance.getActiveAccount();
    if (!account) return;
    await router.replace({ name: 'Register' });
  }

  return { handlePostLogin };
}
