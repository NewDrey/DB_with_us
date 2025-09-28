import {UseGridAnimationProps, GridAnimationHandle} from '../types/types'
import {useCallback} from 'react';

export const getPhysicalPosition = (
    logicalX: number,
    logicalY: number,
    position: { x: number; y: number },
    scale: number
) => {
    return {
        x: position.x + logicalX * scale,
        y: position.y + logicalY * scale
    };
};

export const useGridAnimation = ({
                                     gridState,
                                     setGridState,
                                     containerRef
                                 }: UseGridAnimationProps): GridAnimationHandle => {

    // Основная функция анимации - ядро всей системы
    // Принимает функцию обновления состояния и длительность анимации
    const animate = useCallback((
        updateState: (progress: number) => void, // Функция которая будет вызываться на каждом кадре анимации
        duration: number = 500                    // Длительность анимации в миллисекундах
    ) => {
        // Запоминаем время начала анимации для расчета прогресса
        const startTime = performance.now(); // Используем performance.now() для высокой точности

        // Функция которая будет вызываться на каждом кадре анимации
        const animateFrame = (currentTime: number) => {
            // Вычисляем сколько времени прошло с начала анимации
            const elapsed = currentTime - startTime;
            // Рассчитываем прогресс анимации от 0 до 1
            const progress = Math.min(elapsed / duration, 1); // Ограничиваем максимум 1

            // Easing функция для плавного окончания анимации
            // easeOut: начинается быстро, заканчивается медленно
            // Формула: 1 - (1 - t)^3 создает плавное замедление в конце
            const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
            const easedProgress = easeOut(progress);

            // Вызываем переданную функцию обновления состояния
            // с текущим прогрессом анимации (после применения easing)
            updateState(easedProgress);

            // Если анимация еще не завершена, запрашиваем следующий кадр
            if (progress < 1) {
                requestAnimationFrame(animateFrame); // Рекурсивно вызываем следующий кадр
            }
        };

        // Запускаем анимацию - запрашиваем первый кадр
        requestAnimationFrame(animateFrame);
    }, []); // Нет зависимостей - функция стабильна

    // Центрирование камеры на указанной логической точке с плавной анимацией
    const centerOnPoint = useCallback((
        logicalX: number,     // Логическая X-координата целевой точки
        logicalY: number,     // Логическая Y-координата целевой точки
        duration: number = 500 // Длительность анимации (по умолчанию 500ms)
    ) => {
        // Проверяем что контейнер существует
        if (!containerRef.current) return;

        const container = containerRef.current;
        // Вычисляем центр видимой области (центр экрана)
        const centerX = container.clientWidth / 2;
        const centerY = container.clientHeight / 2;

        // Вычисляем целевую позицию камеры чтобы точка оказалась в центре
        // Формула: camera_position = center - (point_position * scale)
        // Это преобразует логические координаты точки в физические координаты камеры
        const targetX = centerX - logicalX * gridState.scale;
        const targetY = centerY - logicalY * gridState.scale;

        // Запоминаем начальную позицию камеры для анимации
        const startX = gridState.position.x;
        const startY = gridState.position.y;

        // Запускаем анимацию перемещения камеры
        animate(
            (progress) => {
                // Интерполируем позицию от начальной до целевой
                // based на текущем прогрессе анимации
                const newX = startX + (targetX - startX) * progress;
                const newY = startY + (targetY - startY) * progress;

                // Обновляем состояние сетки с новой позицией
                setGridState(prev => ({
                    ...prev, // Сохраняем все остальные свойства (scale, isDragging, etc.)
                    position: { x: newX, y: newY } // Обновляем только позицию
                }));
            },
            duration // Передаем длительность анимации
        );
    }, [
        gridState.scale,      // Зависимость от масштаба (влияет на расчет целевой позиции)
        gridState.position,   // Зависимость от текущей позиции (начальная точка анимации)
        containerRef,         // Зависимость от контейнера (для получения размеров)
        animate,              // Зависимость от функции анимации
        setGridState          // Зависимость от функции обновления состояния
    ]);

    // Возвращаем объект с методами которые можно использовать в компоненте
    return {
        centerOnPoint // Единственный метод - плавное центрирование на точке
    };
};