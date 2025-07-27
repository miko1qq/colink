import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { authService } from '@/lib/supabaseService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, GraduationCap, UserCheck } from 'lucide-react';

export default function TestRegister() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Массивы для генерации случайных данных
  const studentNames = [
    'Айгерим Нурханова', 'Ерасыл Жаксылыков', 'Арузhan Толегенова',
    'Нурсултан Бектуров', 'Динара Сарсенбаева', 'Алихан Кудайбергенов',
    'Мадина Абенова', 'Диас Турсынбеков', 'Зере Айтхожа', 'Тимур Асылханов',
    'Амина Касымова', 'Данияр Оспанов', 'Камила Жунусова', 'Бекзат Мухамедов'
  ];

  const professorNames = [
    'Алидар Коянбаев', 'Гульнара Сейтова', 'Марат Жумабаев',
    'Айжан Темирова', 'Ерлан Назарбаев', 'Сауле Касымбекова'
  ];

  const domains = ['coventry.edu.kz', 'student.coventry.edu.kz'];

  const generateRandomUser = (role: 'student' | 'professor') => {
    const names = role === 'student' ? studentNames : professorNames;
    const randomName = names[Math.floor(Math.random() * names.length)];
    const nameTranslit = randomName
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .replace(/\s+/g, '.')
      .replace(/а/g, 'a').replace(/б/g, 'b').replace(/в/g, 'v')
      .replace(/г/g, 'g').replace(/д/g, 'd').replace(/е/g, 'e')
      .replace(/ж/g, 'zh').replace(/з/g, 'z').replace(/и/g, 'i')
      .replace(/й/g, 'y').replace(/к/g, 'k').replace(/л/g, 'l')
      .replace(/м/g, 'm').replace(/н/g, 'n').replace(/о/g, 'o')
      .replace(/п/g, 'p').replace(/р/g, 'r').replace(/с/g, 's')
      .replace(/т/g, 't').replace(/у/g, 'u').replace(/ф/g, 'f')
      .replace(/х/g, 'h').replace(/ц/g, 'ts').replace(/ч/g, 'ch')
      .replace(/ш/g, 'sh').replace(/щ/g, 'sch').replace(/ы/g, 'y')
      .replace(/э/g, 'e').replace(/ю/g, 'yu').replace(/я/g, 'ya');
    
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const randomNum = Math.floor(Math.random() * 100);
    
    return {
      name: randomName,
      email: `${nameTranslit}${randomNum}@${domain}`,
      password: 'testpass123'
    };
  };

  const handleRegister = async (role: 'student' | 'professor') => {
    setLoading(true);
    setMessage('');

    try {
      const userData = generateRandomUser(role);
      
      const { data, error } = await authService.signUp(
        userData.email,
        userData.password,
        role,
        userData.name
      );

      if (error) {
        setMessage(`❌ Ошибка регистрации: ${error.message}`);
        console.error('Ошибка регистрации:', error);
      } else {
        setMessage(`✅ Пользователь зарегистрирован!
        📧 Email: ${userData.email}
        🔒 Password: ${userData.password}
        👤 Role: ${role}
        📝 Name: ${userData.name}`);
        console.log('Пользователь зарегистрирован:', data);
      }
    } catch (error) {
      setMessage(`❌ Произошла ошибка: ${error}`);
      console.error('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Пробуем войти с тестовыми данными
      const { data, error } = await authService.signIn(
        'student@example.com',
        'testpass123'
      );

      if (error) {
        setMessage(`❌ Ошибка входа: ${error.message}`);
      } else {
        setMessage(`✅ Вход выполнен успешно!`);
        // Перезагружаем страницу чтобы обновить состояние авторизации
        window.location.reload();
      }
    } catch (error) {
      setMessage(`❌ Произошла ошибка: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestStudent = async () => {
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await authService.signUp(
        'student@example.com',
        'testpass123',
        'student',
        'Тестовый Студент'
      );

      if (error) {
        setMessage(`❌ Ошибка создания тестового студента: ${error.message}`);
      } else {
        setMessage(`✅ Тестовый студент создан!
        📧 Email: student@example.com
        🔒 Password: testpass123`);
      }
    } catch (error) {
      setMessage(`❌ Произошла ошибка: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-primary" />
          Тестовая Регистрация
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Создание тестовых аккаунтов для демонстрации системы
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Быстрые действия */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={createTestStudent}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Создать тестового студента
          </Button>

          <Button
            onClick={handleQuickLogin}
            disabled={loading}
            variant="default"
            className="flex items-center gap-2"
          >
            <UserCheck className="h-4 w-4" />
            Войти как тестовый студент
          </Button>

          <Button
            onClick={() => handleRegister('professor')}
            disabled={loading}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <GraduationCap className="h-4 w-4" />
            Создать профессора
          </Button>
        </div>

        {/* Случайная генерация */}
        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            🎲 Случайная генерация пользователей
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => handleRegister('student')}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Случайный студент
            </Button>

            <Button
              onClick={() => handleRegister('professor')}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <GraduationCap className="h-4 w-4" />
              Случайный профессор
            </Button>
          </div>
        </div>

        {/* Сообщение о результате */}
        {message && (
          <div className="p-4 bg-muted rounded-lg border">
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {message}
            </pre>
          </div>
        )}

        {/* Информация */}
        <div className="border-t pt-4 space-y-2">
          <h3 className="font-semibold">ℹ️ Информация:</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Тестовые пароли: <code className="bg-muted px-1 rounded">testpass123</code></p>
            <p>• Быстрый тестовый аккаунт: <code className="bg-muted px-1 rounded">student@example.com</code></p>
            <p>• Случайные пользователи генерируются с реалистичными казахскими именами</p>
            <p>• После регистрации проверьте почту для подтверждения (если настроено)</p>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Badge variant="outline">Development Only</Badge>
            <Badge variant="secondary">Demo Purposes</Badge>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Обработка...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}