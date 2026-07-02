import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Image, StatusBar } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { api } from '../src/api/api';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#0A2342]"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Верхняя декоративная часть */}
      <View className="flex-[0.4] justify-center items-center px-6 pt-12">
        <View className="w-24 h-24 bg-white/10 rounded-full items-center justify-center mb-6">
          <Ionicons name="medical" size={48} color="#0891B2" />
        </View>
        <Text className="text-4xl font-bold text-white mb-2 tracking-wider">
          МедСклад
        </Text>
        <Text className="text-cyan-200/80 text-base font-medium text-center px-4">
          Система умного управления медицинскими запасами
        </Text>
      </View>
      
      {/* Нижняя часть с формой */}
      <View className="flex-[0.6] bg-white rounded-t-[40px] px-8 pt-10 pb-6 shadow-2xl">
        <Text className="text-2xl font-extrabold text-slate-800 mb-8">
          С возвращением
        </Text>
        
        <View className="space-y-6">
          {/* Email Input */}
          <View>
            <Text className="text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-wider">Email</Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 h-14 focus:border-cyan-500 focus:bg-white">
              <Ionicons name="mail-outline" size={20} color="#94A3B8" />
              <TextInput
                className="flex-1 ml-3 text-slate-800 font-medium h-full"
                placeholder="Введите ваш email"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-sm font-bold text-slate-500 mb-2 ml-1 uppercase tracking-wider">Пароль</Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 h-14 focus:border-cyan-500 focus:bg-white">
              <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
              <TextInput
                className="flex-1 ml-3 text-slate-800 font-medium h-full"
                placeholder="Введите пароль"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2">
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity className="mt-4 mb-8">
          <Text className="text-cyan-600 font-semibold text-right text-sm">Забыли пароль?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity 
          className="w-full bg-[#0891B2] h-14 rounded-2xl items-center justify-center shadow-lg shadow-cyan-500/30 active:bg-cyan-700"
          onPress={handleLogin}
        >
          <Text className="text-white font-bold text-lg tracking-wide">Войти в систему</Text>
        </TouchableOpacity>
        
        <View className="flex-row justify-center mt-8">
          <Text className="text-slate-500 text-sm">Нет аккаунта? </Text>
          <TouchableOpacity>
            <Text className="text-cyan-600 font-bold text-sm">Свяжитесь с админом</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
