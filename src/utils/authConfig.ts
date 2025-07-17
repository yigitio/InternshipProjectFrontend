// src/utils/authConfig.ts
export const msalConfig = {
  auth: {
    clientId: process.env.VUE_APP_AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.VUE_APP_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: { cacheLocation: 'localStorage', storeAuthStateInCookie: false },
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'User.Read'],
};
