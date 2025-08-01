// src/utils/authConfig.ts
import type { Configuration } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.VUE_APP_AZURE_CLIENT_ID!, // Azure AD Uygulama (İstemci) ID’n
    authority: `https://login.microsoftonline.com/${process.env.VUE_APP_AZURE_TENANT_ID}`, // Tenant ID
    redirectUri: window.location.origin, // Redirect URI
  },
  cache: {
    cacheLocation: 'localStorage', // Token’ları localStorage’da tut
    storeAuthStateInCookie: false, // Çerez’de tutmak istersen true yapabilirsin
  },
};

export const loginRequest = {
  scopes: [
    'openid', // Kullanıcının kimlik numarasını (sub) alabilmek için
    'profile', // Kullanıcının temel profil bilgilerini (name, preferred_username vb.) alabilmek için
    'User.Read', // Microsoft Graph üzerinden /me endpoint’ine erişerek jobTitle çekebilmek için
    'Mail.Send',
  ],
};
