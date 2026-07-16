export const ADMIN_AUTH_URL = 'https://functions.poehali.dev/c177c9bb-9014-4624-84e0-5823bc37ccd6';
export const CARS_ADMIN_URL = 'https://functions.poehali.dev/e918aaeb-8262-410b-a843-0359b44b2e34';
export const UPLOAD_FILE_URL = 'https://functions.poehali.dev/e44611d7-6874-4eca-a213-a039badaa662';

export const getToken = () => localStorage.getItem('admin_token');
export const setToken = (t: string) => localStorage.setItem('admin_token', t);
export const clearToken = () => localStorage.removeItem('admin_token');

export const authHeaders = (): Record<string, string> => {
  const token = getToken();
  return token ? { 'X-Auth-Token': token } : {};
};
