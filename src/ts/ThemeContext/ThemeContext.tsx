// contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Определяем тип для темы - может быть только 'light' или 'dark'
export type Theme = 'light' | 'dark';

// Интерфейс описывает структуру контекста темы
interface ThemeContextType {
    theme: Theme;           // Текущая тема
    toggleTheme: () => void; // Функция для переключения темы
}

// Создаем контекст с начальным значением undefined
// Типизируем его как ThemeContextType или undefined
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Интерфейс для пропсов ThemeProvider
// children - содержимое, которое будет обернуто провайдером
interface ThemeProviderProps {
    children: ReactNode;
}

// Основной компонент-провайдер темы
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    // Используем useState с ленивой инициализацией (функция вместо значения)
    const [theme, setTheme] = useState<Theme>(() => {
        // Пробуем получить тему из localStorage
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme) return savedTheme; // Если есть сохраненная - используем ее

        // Проверяем системные предпочтения пользователя
        // matchMedia проверяет CSS медиа-запрос
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark'; // Если система в темном режиме - используем dark
        }

        return 'light'; // По умолчанию светлая тема
    });

    // Функция для переключения темы
    const toggleTheme = () => {
        // Используем функциональное обновление состояния
        // prevTheme - предыдущее значение темы
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    // useEffect выполняется при изменении темы
    useEffect(() => {
        // Сохраняем тему в localStorage для сохранения выбора пользователя
        localStorage.setItem('theme', theme);

        // Применяем тему к корневому HTML элементу через data-атрибут
        // Это позволяет использовать в CSS селекторы типа [data-theme="dark"]
        document.documentElement.setAttribute('data-theme', theme);

        // Дополнительно управляем классом для большей гибкости
        // Можно использовать в CSS селекторы типа .dark
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]); // Зависимость - theme, эффект выполнится при ее изменении

    // Возвращаем провайдер контекста с текущей темой и функцией переключения
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Кастомный хук для удобного использования темы
export const useTheme = (): ThemeContextType => {
    // Получаем значение из контекста
    const context = useContext(ThemeContext);

    // Проверяем, используется ли хук внутри ThemeProvider
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    // Возвращаем контекст (объект с theme и toggleTheme)
    return context;
};