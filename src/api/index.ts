import { Api } from './Api';

export const api = new Api({
    baseURL: 'https://localhost:8000/api/',
    withCredentials: true
});
