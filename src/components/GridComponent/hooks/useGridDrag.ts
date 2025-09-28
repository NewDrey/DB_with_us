import React, { useCallback, useState } from 'react';
import { GridState } from '../types/types';

// Хуки перетаскивания элементов
export const useGridDrag = () => {
    // Состояние сетки: позиция, масштаб, флаги перетаскивания
    const [gridState, setGridState] = useState<GridState>({
        position: { x: 0, y: 0 },     // Текущее смещение сетки в пикселях
        scale: 1,                     // Текущий масштаб (1.0 = 100%)
        isDragging: false,            // Флаг: происходит ли перетаскивание сетки
        lastMousePos: { x: 0, y: 0 }  // Последняя позиция мыши для расчета дельты
    });

    // Обработчик нажатия кнопки мыши (начало перетаскивания)
    const handleMouseDown = useCallback((e: React.MouseEvent, isChildDragging: boolean) => {
        // Начинаем перетаскивание сетки только если:
        // 1. Не перетаскивается дочерний элемент (приоритет у детей)
        // 2. Нажата левая кнопка мыши (e.button === 0)
        if (!isChildDragging && e.button === 0) {
            setGridState(prev => ({
                ...prev,
                isDragging: true, // Активируем флаг перетаскивания
                lastMousePos: { x: e.clientX, y: e.clientY } // Запоминаем стартовую позицию
            }));
        }
    }, []); // Нет зависимостей - функция стабильна

    // Обработчик движения мыши (процесс перетаскивания)
    const handleMouseMove = useCallback((e: MouseEvent, isChildDragging: boolean) => {
        // Если перетаскивается дочерний элемент - игнорируем движение сетки
        if (isChildDragging) return;

        // Если сетка не в режиме перетаскивания - выходим
        if (!gridState.isDragging) return;

        // Вычисляем разницу между текущей и предыдущей позицией мыши
        const deltaX = e.clientX - gridState.lastMousePos.x;
        const deltaY = e.clientY - gridState.lastMousePos.y;

        // Обновляем позицию сетки, добавляя вычисленную дельту
        setGridState(prev => ({
            ...prev,
            position: {
                x: prev.position.x + deltaX, // Новый X = старый X + смещение по X
                y: prev.position.y + deltaY  // Новый Y = старый Y + смещение по Y
            },
            lastMousePos: { x: e.clientX, y: e.clientY } // Обновляем последнюю позицию
        }));
    }, [gridState.isDragging, gridState.lastMousePos]); // Зависимости: флаг драга и последняя позиция

    // Обработчик отпускания кнопки мыши (конец перетаскивания)
    const handleMouseUp = useCallback((isChildDragging: boolean) => {
        // Сбрасываем флаг перетаскивания сетки только если не перетаскивается ребенок
        if (!isChildDragging) {
            setGridState(prev => ({
                ...prev,
                isDragging: false // Деактивируем флаг перетаскивания
            }));
        }
    }, []); // Нет зависимостей

    // Возвращаем состояние и методы для использования в компоненте
    return {
        gridState,           // Текущее состояние сетки
        setGridState,        // Функция для прямого обновления состояния
        handleMouseDown,     // Обработчик начала перетаскивания
        handleMouseMove,     // Обработчик движения при перетаскивании
        handleMouseUp        // Обработчик завершения перетаскивания
    };
};