import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getDynamicHeaders } from '../utils/requestHeader';
import { useAuthStore } from '../store/useAuthStore';

export const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const dynamic = getDynamicHeaders();
      const token = useAuthStore.getState().tokens?.accessToken;
      
      config.headers['timestamp'] = dynamic.timestamp;
      config.headers['xRequestId'] = dynamic.xRequestId;
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
};