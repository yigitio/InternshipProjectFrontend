// src/plugins/msal.ts
import { App } from 'vue';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../utils/authConfig';

const msalInstance = new PublicClientApplication(msalConfig);

export default {
  install: (app: App) => {
    app.config.globalProperties.$msalInstance = msalInstance;
    app.provide('msalInstance', msalInstance);
  },
};

export { msalInstance };
