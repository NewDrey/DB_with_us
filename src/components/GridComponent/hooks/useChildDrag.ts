import React, { useCallback, useState } from 'react';
import { DragState } from '../types/types';

export const useChildDrag = (onChildDrag?: (index: number, x: number, y: number) => void) => {
    // Состояние перетаскивания конкретного дочернего элемента
    const [childDragState, setChildDragState] = useState<DragState>({
        isDragging: false,      // Флаг: происходит ли перетаскивание элемента
        childIndex: null,       // Индекс перетаскиваемого элемента в массиве детей
        startLogicalX: 0,       // Логическая X-координата элемента в момент начала drag
        startLogicalY: 0,       // Логическая Y-координата элемента в момент начала drag
        startMouseX: 0,         // Физическая X-координата мыши в момент начала drag
        startMouseY: 0          // Физическая Y-координата мыши в момент начала drag
    });

    // Обработчик начала перетаскивания дочернего элемента
    const handleChildMouseDown = useCallback((
        e: React.MouseEvent,
        index: number,          // Индекс элемента в массиве детей
        logicalX: number,       // Текущая логическая X-координата элемента
        logicalY: number        // Текущая логическая Y-координата элемента
    ) => {
        e.stopPropagation(); // Останавливаем всплытие события чтобы не активировался drag сетки

        // Инициализируем состояние перетаскивания
        setChildDragState({
            isDragging: true,           // Активируем флаг перетаскивания
            childIndex: index,          // Запоминаем какой элемент drag-аем
            startLogicalX: logicalX,    // Запоминаем начальную логическую позицию элемента
            startLogicalY: logicalY,    // (координаты в виртуальном пространстве сетки)
            startMouseX: e.clientX,     // Запоминаем начальную физическую позицию мыши
            startMouseY: e.clientY      // (координаты на экране в пикселях)
        });
    }, []); // Нет зависимостей - функция стабильна

    // Обработчик движения мыши при перетаскивании элемента
    const handleChildMouseMove = useCallback((
        e: MouseEvent,
        scale: number // Текущий масштаб сетки для преобразования координат
    ) => {
        // Проверяем условия для выполнения drag:
        // 1. Должен быть активен флаг перетаскивания
        // 2. Должен быть указан индекс элемента
        if (!childDragState.isDragging || childDragState.childIndex === null) return;

        // Вычисляем физическое смещение мыши от начальной точки
        const deltaX = e.clientX - childDragState.startMouseX;
        const deltaY = e.clientY - childDragState.startMouseY;

        // Преобразуем физическое смещение в логическое с учетом масштаба
        // Пример: scale=0.5, deltaX=100px → logicalDeltaX=200 логических единиц
        const logicalDeltaX = deltaX / scale;
        const logicalDeltaY = deltaY / scale;

        // Рассчитываем новые логические координаты элемента
        const newLogicalX = childDragState.startLogicalX + logicalDeltaX;
        const newLogicalY = childDragState.startLogicalY + logicalDeltaY;

        // Вызываем callback-функцию для уведомления родителя о новом положении
        onChildDrag?.(childDragState.childIndex, newLogicalX, newLogicalY);
    }, [childDragState, onChildDrag]); // Зависимости: состояние drag и callback-функция

    // Обработчик завершения перетаскивания
    const handleChildMouseUp = useCallback(() => {
        // Сбрасываем состояние перетаскивания, сохраняя остальные данные
        setChildDragState(prev => ({
            ...prev,                // Сохраняем предыдущие значения (на всякий случай)
            isDragging: false,      // Деактивируем флаг перетаскивания
            childIndex: null        // Сбрасываем индекс элемента
        }));
    }, []); // Нет зависимостей

    // Возвращаем состояние и методы для использования в компоненте
    return {
        childDragState,         // Текущее состояние перетаскивания элемента
        handleChildMouseDown,   // Обработчик начала перетаскивания
        handleChildMouseMove,   // Обработчик движения при перетаскивании
        handleChildMouseUp      // Обработчик завершения перетаскивания
    };
};