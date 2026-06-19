import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { api } from '../src/api/api';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      await login(response.data.token, response.data.user);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Ошибка авторизации', error.response?.data?.error || 'Не удалось войти');
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-slate-50 p-6">
      <Text className="text-3xl font-bold text-slate-800 mb-8">МедСклад</Text>
      
      <View className="w-full bg-white p-6 rounded-2xl shadow-sm">
        <Text className="text-sm font-semibold text-slate-600 mb-2">Email</Text>
        <TextInput
          className="w-full bg-slate-100 p-4 rounded-xl mb-4"
          placeholder="Введите email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text className="text-sm font-semibold text-slate-600 mb-2">Пароль</Text>
        <TextInput
          className="w-full bg-slate-100 p-4 rounded-xl mb-6"
          placeholder="Введите пароль"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          className="w-full bg-cyan-600 p-4 rounded-xl items-center"
          onPress={handleLogin}
        >
          <Text className="text-white font-bold text-lg">Войти</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
