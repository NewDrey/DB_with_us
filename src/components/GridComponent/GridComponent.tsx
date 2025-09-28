import React, { useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useGridDrag } from './hooks/useGridDrag';
import { useChildDrag } from './hooks/useChildDrag';
import { useGridZoom } from './hooks/useGridZoom';
import { useGridDrawing } from './hooks/useGridDrawing';
import { getPhysicalPosition, useGridAnimation } from './utils/coordinates';

import { GridProps, GridHandle, ChildWithPositionProps } from './types/types';
import './GridComponent.scss'

const GridComponent = forwardRef<GridHandle, GridProps>(({
                                                                       gridSize = 40,
                                                                       children,
                                                                       onChildDrag
                                                                   }, ref) => {
    // Ref для доступа к DOM-контейнеру сетки
    const containerRef = useRef<HTMLDivElement>(null);

    // Хук для перетаскивания всей сетки
    const {
        gridState,           // Состояние сетки: позиция, масштаб, флаги
        setGridState,        // Функция обновления состояния сетки
        handleMouseDown,     // Обработчик начала перетаскивания сетки
        handleMouseMove,     // Обработчик движения при перетаскивании сетки
        handleMouseUp        // Обработчик завершения перетаскивания сетки
    } = useGridDrag();

    // Хук для перетаскивания отдельных дочерних элементов
    const {
        childDragState,          // Состояние перетаскивания ребенка
        handleChildMouseDown,    // Обработчик начала перетаскивания ребенка
        handleChildMouseMove,    // Обработчик движения при перетаскивании ребенка
        handleChildMouseUp       // Обработчик завершения перетаскивания ребенка
    } = useChildDrag(onChildDrag);

    // Хук для обработки зума колесиком мыши
    useGridZoom(containerRef, gridState, setGridState);

    // Хук для отрисовки сетки на canvas
    useGridDrawing(containerRef, gridState, gridSize);

    // Метод для центрирования камеры на логической точке
    const { centerOnPoint } = useGridAnimation({
        gridState,
        setGridState,
        containerRef
    });

    // Экспортируем методы через ref
    useImperativeHandle(ref, () => ({
        getScale: () => gridState.scale,
        getPosition: () => gridState.position,
        setPosition: (x: number, y: number) => setGridState(prev => ({ ...prev, position: { x, y } })),
        centerOnPoint: centerOnPoint // ← Экспортируем метод центрирования
    }), [gridState.scale, gridState.position, setGridState, centerOnPoint]);

    // Объединенный обработчик движения мыши - диспетчер событий
    const combinedHandleMouseMove = useCallback((e: MouseEvent) => {
        // Приоритет №1: если перетаскивается ребенок - обрабатываем его движение
        if (childDragState.isDragging) {
            handleChildMouseMove(e, gridState.scale);
            return; // Важно: выходим, чтобы не обрабатывать движение сетки
        }

        // Приоритет №2: если перетаскивается сетка - обрабатываем ее движение
        handleMouseMove(e, childDragState.isDragging);
    }, [
        childDragState.isDragging,  // Зависимость от состояния drag ребенка
        handleChildMouseMove,       // Функция обработки движения ребенка
        gridState.scale,            // Текущий масштаб для преобразования координат
        handleMouseMove             // Функция обработки движения сетки
    ]);

    // Объединенный обработчик отпускания мыши
    const combinedHandleMouseUp = useCallback(() => {
        // Определяем что именно нужно завершить: drag ребенка или сетки
        if (childDragState.isDragging) {
            handleChildMouseUp();  // Завершаем drag ребенка
        } else {
            handleMouseUp(childDragState.isDragging); // Завершаем drag сетки
        }
    }, [
        childDragState.isDragging,  // Зависимость от состояния drag ребенка
        handleChildMouseUp,         // Функция завершения drag ребенка
        handleMouseUp               // Функция завершения drag сетки
    ]);

    // Эффект для глобальной подписки на события мыши
    useEffect(() => {
        // Подписываемся только если активно какое-либо перетаскивание
        if (gridState.isDragging || childDragState.isDragging) {
            // Глобальные события для отслеживания мыши за пределами компонента
            window.addEventListener('mousemove', combinedHandleMouseMove);
            window.addEventListener('mouseup', combinedHandleMouseUp);

            // Cleanup: обязательно отписываемся при размонтировании или изменении зависимостей
            return () => {
                window.removeEventListener('mousemove', combinedHandleMouseMove);
                window.removeEventListener('mouseup', combinedHandleMouseUp);
            };
        }
    }, [
        gridState.isDragging,       // Активно ли перетаскивание сетки
        childDragState.isDragging,  // Активно ли перетаскивание ребенка
        combinedHandleMouseMove,    // Объединенный обработчик движения
        combinedHandleMouseUp       // Объединенный обработчик отпускания
    ]);

    // Функция рендеринга дочерних элементов с применением трансформаций
    const renderedChildren = React.Children.map(children, (child, index) => {
        // Проверяем что элемент валидный React-элемент
        if (!React.isValidElement<ChildWithPositionProps>(child)) return child;

        // Извлекаем пропсы и данные из элемента
        const props = child.props;
        const logicalX = Number(props['data-position-x']) || 0;     // Логическая X-координата
        const logicalY = Number(props['data-position-y']) || 0;     // Логическая Y-координата
        const childIndex = Number(props['data-child-index']) || index; // Индекс ребенка

        // Преобразуем логические координаты в физические для отображения
        const physicalPos = getPhysicalPosition(
            logicalX,
            logicalY,
            gridState.position,
            gridState.scale
        );

        // Сохраняем оригинальный обработчик onMouseDown если он был
        const originalOnMouseDown = props.onMouseDown;

        // Клонируем элемент с новыми пропсами
        return React.cloneElement(child, {
            style: {
                ...props.style, // Сохраняем оригинальные стили
                position: 'absolute',
                left: 0,
                top: 0,
                // Применяем трансформацию: смещение + масштаб
                transform: `translate(${physicalPos.x}px, ${physicalPos.y}px) scale(${gridState.scale})`,
                transformOrigin: '0 0', // Точка трансформации - левый верхний угол
                // Динамический курсор: grabbing при активном drag, иначе grab
                cursor: childDragState.childIndex === childIndex ? 'grabbing' : 'grab',
                userSelect: 'none' // Запрещаем выделение текста при drag
            },
            // Объединенный обработчик нажатия мыши
            onMouseDown: (e: React.MouseEvent) => {
                // Сначала наш обработчик для начала перетаскивания
                handleChildMouseDown(e, childIndex, logicalX, logicalY);
                // Затем вызываем оригинальный обработчик если он был
                originalOnMouseDown?.(e);
            }
        } as Partial<ChildWithPositionProps>);
    });

    // Рендер основного компонента
    return (
        <div
            ref={containerRef} // Ref для доступа к DOM-элементу
            onMouseDown={(e) => handleMouseDown(e, childDragState.isDragging)} // Обработчик клика по сетке
            className={'gridContainer'}
            style={{
                cursor: gridState.isDragging ? 'grabbing' : (childDragState.isDragging ? 'grabbing' : 'grab'),
            }}
        >
            {/* Canvas для отрисовки сетки */}
            <canvas className='gridCanvas' />

            {/* Контейнер для дочерних элементов с абсолютным позиционированием */}
            <div className='gridChildrenContainer'>
                {renderedChildren}
            </div>
        </div>
    );
});

export default GridComponent;