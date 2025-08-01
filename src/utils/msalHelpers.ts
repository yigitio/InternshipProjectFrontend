import { msalApp } from '@/main';
import { InteractionRequiredAuthError } from '@azure/msal-browser';

export async function getAccessToken(
  scopes: string[] = ['Mail.Send', 'User.Read']
): Promise<string> {
  const account = msalApp.getActiveAccount();
  if (!account) throw new Error('Aktif kullanıcı yok');

  try {
    const result = await msalApp.acquireTokenSilent({ account, scopes });
    return result.accessToken;
  } catch (e: any) {
    if (e instanceof InteractionRequiredAuthError) {
      console.warn('Silent token alınamadı, popup ile isteniyor...');
      const result = await msalApp.acquireTokenPopup({ account, scopes });
      return result.accessToken;
    } else {
      throw e;
    }
  }
}
