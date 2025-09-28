import React, { useEffect } from 'react';
import store from '../../../ts/store';

// Обработчик текущей темы
export const useThemeBackground = (containerRef: React.RefObject<HTMLDivElement | null>) => {
    const gridBackGround = store.getters.getTheme('backgroundColor');
    useEffect(() => {

        if (containerRef.current) { // Проверка на null
            containerRef.current.style.backgroundColor = gridBackGround;
        }
    }, [containerRef, gridBackGround]);
};