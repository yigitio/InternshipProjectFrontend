// src/shims-vue3-msal-plugin.d.ts
import type {
  Configuration,
  PublicClientApplication,
  InteractionStatus,
  AccountInfo,
  AuthenticationResult,
  PopupRequest,
  RedirectRequest,
  SilentRequest,
} from '@azure/msal-browser';
import type { Ref, Plugin } from 'vue';

declare module 'vue3-msal-plugin' {
  // msalInstance(config) -> PublicClientApplication
  export function msalInstance(config: Configuration): PublicClientApplication;

  // Vue.use(msalPlugin, instance)
  export const msalPlugin: Plugin;

  // Composables
  export function useMsal(): {
    instance: PublicClientApplication;
    accounts: Ref<AccountInfo[]>;
    inProgress: Ref<InteractionStatus>;
    loginRequest: { scopes: string[] };
    callMsGraph: (token: string) => Promise<any>;
  };

  export function useIsAuthenticated(): Ref<boolean>;

  export function useMsalAuthentication(
    interactionType: InteractionStatus,
    request: PopupRequest | RedirectRequest | SilentRequest
  ): {
    acquireToken: (
      override?: PopupRequest | RedirectRequest | SilentRequest
    ) => Promise<AuthenticationResult>;
    result: Ref<AuthenticationResult | null>;
    error: Ref<any>;
    inProgress: Ref<InteractionStatus>;
  };
}
