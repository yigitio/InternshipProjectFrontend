export const msalConfig = {
  auth: {
    clientId: process.env.VUE_APP_AZURE_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${process.env.VUE_APP_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: any, message: any, containsPii: any) => {
        if (containsPii) return;
        console.log(message);
      },
      logLevel: 2, // LogLevel.Info
    },
  },
};
