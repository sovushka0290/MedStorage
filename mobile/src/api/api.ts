import axios from 'axios';
import { Platform } from 'react-native';

// Умное переключение URL: для Android эмулятора нужен 10.0.2.2, для iOS и веба - 127.0.0.1
// Временно используем публичный URL (localhost.run) для тестирования техдиректором:
const baseURL = 'https://015aa103d7b7d1.lhr.life/api';

export const api = axios.create({
  baseURL,
});
