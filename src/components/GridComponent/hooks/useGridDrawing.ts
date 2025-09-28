import React, { useCallback, useEffect } from 'react';
import { GridState } from '../types/types';
import store from '../../../ts/store';

// Отрисовка канваса.
export const useGridDrawing = (
    containerRef: React.RefObject<HTMLDivElement | null>, // Ref на контейнер сетки
    gridState: GridState, // Состояние сетки (позиция, масштаб)
    gridSize: number // Базовый размер клетки сетки
) => {
    // Получаем цвет сетки из темы
    const gridColor = store.getters.getTheme('gridColor');

    // Функция отрисовки сетки на canvas
    const drawGrid = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        // Очищаем canvas перед каждой отрисовкой
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Настраиваем стиль линий сетки
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;

        // Рассчитываем размер клетки с учетом текущего масштаба
        const scaledGridSize = gridSize * gridState.scale;

        // Рассчитываем смещение для бесконечной сетки
        // Остаток от деления позиции на размер клетки обеспечивает плавное движение
        const gridOffsetX = gridState.position.x % scaledGridSize;
        const gridOffsetY = gridState.position.y % scaledGridSize;

        // Отрисовка вертикальных линий сетки
        for (let x = gridOffsetX; x < canvas.width; x += scaledGridSize) {
            ctx.beginPath();                   // Начинаем новый путь
            ctx.moveTo(x, 0);               // Переходим к начальной точке (верх)
            ctx.lineTo(x, canvas.height);      // Рисуем линию до нижнего края
            ctx.stroke();                      // Применяем обводку
        }

        // Отрисовка горизонтальных линий сетки
        for (let y = gridOffsetY; y < canvas.height; y += scaledGridSize) {
            ctx.beginPath();                    // Начинаем новый путь
            ctx.moveTo(0, y);                // Переходим к начальной точке (левый край)
            ctx.lineTo(canvas.width, y);        // Рисуем линию до правого края
            ctx.stroke();                       // Применяем обводку
        }
    }, [gridState.position, gridState.scale, gridSize, gridColor]); // Зависимости для перерисовки

    // Эффект для первоначальной настройки canvas и обработки ресайза
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return; // Выходим если контейнер не найден

        const canvas = container.querySelector('canvas');
        if (!canvas) return; // Выходим если canvas не найден

        const ctx = canvas.getContext('2d');
        if (!ctx) return; // Выходим если контекст не доступен

        // Функция изменения размера canvas под размер контейнера
        const resizeCanvas = () => {
            canvas.width = container.clientWidth;   // Ширина = ширина контейнера
            canvas.height = container.clientHeight; // Высота = высота контейнера
            drawGrid(ctx, canvas); // Перерисовываем сетку после ресайза
        };

        // Первоначальная настройка размеров
        resizeCanvas();
        drawGrid(ctx, canvas);

        // Слушаем события изменения размера окна
        window.addEventListener('resize', resizeCanvas);

        // Cleanup: удаляем слушатель при размонтировании
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [containerRef, drawGrid]); // Зависимости: контейнер и функция отрисовки

    // Эффект для перерисовки при изменении состояния сетки
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const canvas = container.querySelector('canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Перерисовываем сетку когда изменяются параметры отрисовки
        drawGrid(ctx, canvas);
    }, [containerRef, drawGrid]); // Перерисовываем когда меняется функция drawGrid
};