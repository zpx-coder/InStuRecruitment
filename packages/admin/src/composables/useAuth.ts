import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { login as loginApi } from '../api';
import type { LoginPayload } from '../api';

const TOKEN_KEY = 'token';
const USERNAME_KEY = 'admin_username';
const REMEMBER_KEY = 'admin_remember';

const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
const username = ref<string | null>(localStorage.getItem(USERNAME_KEY));
const rememberMe = ref(localStorage.getItem(REMEMBER_KEY) === 'true');

export function useAuth() {
  const router = useRouter();

  const isLoggedIn = computed(() => !!token.value);

  async function login(payload: LoginPayload): Promise<void> {
    const res: any = await loginApi(payload);
    token.value = res.token;
    username.value = payload.username;

    if (rememberMe.value) {
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USERNAME_KEY, payload.username);
      localStorage.setItem(REMEMBER_KEY, 'true');
    } else {
      sessionStorage.setItem(TOKEN_KEY, res.token);
      sessionStorage.setItem(USERNAME_KEY, payload.username);
      localStorage.removeItem(REMEMBER_KEY);
    }
  }

  function logout(): void {
    token.value = null;
    username.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USERNAME_KEY);
    router.push({ name: 'Login' });
  }

  function getToken(): string | null {
    return token.value || sessionStorage.getItem(TOKEN_KEY);
  }

  return {
    token,
    username,
    rememberMe,
    isLoggedIn,
    login,
    logout,
    getToken,
  };
}
