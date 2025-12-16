import axios from 'axios';
import { PageResponse } from '@/types';

const accessToken = process.env.NEXT_PUBLIC_STRAPI_ACCESS_TOKEN;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export const strapiApiService = {
  async getPages(): Promise<PageResponse[]> {
    try {
      const response = await api.get('/api/pages?populate=*');
      return response.data;
    } catch (error) {
      console.error('Error fetching pages from Strapi:', error);
      throw error;
    }
  },
};