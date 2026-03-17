import axios from 'axios';
import { staticHeaders } from '../utils/requestHeader';
import { setupInterceptors } from './interceptors';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '/api-proxy',
  timeout: 5000,
  headers: staticHeaders, // Only common i.e static headers here
});

setupInterceptors(instance);

export default instance;