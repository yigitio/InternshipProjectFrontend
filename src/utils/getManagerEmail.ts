// src/utils/getManagerEmail.ts
import { msalApp } from '@/main';

export async function getManagerEmail(): Promise<string> {
  const account = msalApp.getActiveAccount();
  if (!account) throw new Error('Aktif hesap bulunamadı.');

  const result = await msalApp.acquireTokenSilent({
    account,
    scopes: ['User.Read'], // Manager endpoint için yeterli
  });

  const response = await fetch('https://graph.microsoft.com/v1.0/me/manager', {
    headers: {
      Authorization: `Bearer ${result.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Manager bilgisi alınamadı');
  }

  const data = await response.json();
  return data.mail; // veya data.userPrincipalName
}
