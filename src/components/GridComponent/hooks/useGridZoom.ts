import React, { useEffect } from 'react';
import { GridState } from '../types/types';

// Хуки отдаления-приближения канваса
export const useGridZoom = (
    containerRef: React.RefObject<HTMLDivElement | null>, // Ref на контейнер сетки для подписки на события
    gridState: GridState, // Текущее состояние сетки (позиция, масштаб)
    setGridState: React.Dispatch<React.SetStateAction<GridState>> // Функция для обновления состояния
) => {
    useEffect(() => {
        // Обработчик события колесика мыши
        const handleWheel = (e: WheelEvent) => {
            // когда зажата клавиша Ctrl - управляем масштабом
            if (e.ctrlKey) {
                e.preventDefault(); // Предотвращаем стандартное поведение браузера (например, масштаб страницы)

                const zoomIntensity = 0.1; // Интенсивность зума (шаг изменения масштаба)

                // Определяем направление зума на основе направления прокрутки
                const newScale = e.deltaY > 0
                    ? Math.max(0.1, gridState.scale - zoomIntensity)        // Zoom OUT: колесо вниз → уменьшаем масштаб (min 0.1)
                    : Math.min(5, gridState.scale + zoomIntensity);         // Zoom IN: колесо вверх → увеличиваем масштаб (max 5.0)

                // Обновляем состояние с новым масштабом
                setGridState(prev => ({
                    ...prev,
                    scale: newScale // Сохраняем всю предыдущую структуру, меняем только scale
                }));
            }
            // ГОРИЗОНТАЛЬНЫЙ СКРОЛЛ: когда зажата клавиша Shift
            else if (e.shiftKey) {
                // Для горизонтального скролла используем deltaY (колесико) но применяем как горизонтальное смещение
                setGridState(prev => ({
                    ...prev,
                    position: {
                        x: prev.position.x - e.deltaY, // deltaY → горизонтальное движение
                        y: prev.position.y - e.deltaX  // deltaX → вертикальное движение (меньший эффект)
                    }
                }));
            }
            // ОБЫЧНЫЙ СКРОЛЛ: без модификаторов - панорамирование сетки
            else {
                setGridState(prev => ({
                    ...prev,
                    position: {
                        x: prev.position.x - e.deltaX, // Горизонтальное смещение
                        y: prev.position.y - e.deltaY  // Вертикальное смещение
                    }
                }));
            }
        };

        // Получаем DOM-элемент контейнера
        const container = containerRef.current;
        if (!container) return; // Выходим если контейнер не существует

        // Подписываемся на событие колесика мыши
        container.addEventListener('wheel', handleWheel, {
            passive: false // Важно: passive: false позволяет использовать preventDefault()
        });

        // Cleanup: отписываемся от события при размонтировании компонента
        return () => container.removeEventListener('wheel', handleWheel);
    }, [containerRef, gridState.scale, setGridState]); // Зависимости: контейнер, текущий масштаб, функция обновления
};