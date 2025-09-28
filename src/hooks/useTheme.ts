import { useState, useEffect } from 'react';
import store from '../store/StyleStore';

// Хук подписки на обновление темы
export const useTheme = () => {
    const [theme, setTheme] = useState(store.state.theme);

    useEffect(() => {
        // Функция для обновления темы
        const updateTheme = () => {
            setTheme(store.state.theme);
        };

        // Подписываемся на изменения
        const unsubscribe = store.subscribe(updateTheme);

        // Функция очистки - должна возвращать void
        return () => {
            unsubscribe(); // Просто вызываем, не возвращаем значение
        };
    }, []);

    return theme;
};