import { Api } from './Api';

export const auth_api = new Api({
    baseURL: 'https://localhost:8008/api/',
    withCredentials: true
});
