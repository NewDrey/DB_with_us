import GridComponent from "../../components/GridComponent/GridComponent";
import React, {useRef, useState} from "react";
import TableComponent from "../../components/TableComponent/TableComponent";
import LeftBar from "../../components/LeftBar/LeftBar";
import LeftBarButton from "../../components/LeftBarButton/LeftBarButton";
import {FaPlusCircle} from "react-icons/fa";
import {GridHandle} from '../../components/GridComponent/types/types'

interface ChildPosition {
    x: number;
    y: number;
}

// Страница с основным конструктором
const GridPage = () => {
    const [childPositions, setChildPositions] = useState<ChildPosition[]>([{ x: 0, y: 0 }]); // Позиции дочерних элементов (таблиц)
    const childRefs = useRef<(HTMLDivElement | null)[]>([]); // Список дочерних элементов
    const gridRef = useRef<GridHandle>(null); // ← Ref для доступа к методам GridComponent

    // Добавляем новый элемент таблицы
    const addChild = () => {
        setChildPositions(prev => {
            const lastPos = prev[prev.length - 1];
            const newPos = { x: lastPos.x + 290, y: lastPos.y };

            // Центрируем экран на новом элементе после его создания
            setTimeout(() => {
                gridRef.current?.centerOnPoint(newPos.x, newPos.y);
            }, 10);

            return [...prev, newPos];
        });


    }

    // Обработчик перемещения элемента (таблицы)
    const handleChildDrag = (index: number, newLogicalX: number, newLogicalY: number) => {
        setChildPositions(prev => {
            const newPositions = [...prev];
            newPositions[index] = { x: newLogicalX, y: newLogicalY };
            return newPositions;
        });
    };

    // Создаем массив дочерних элементов
    const gridChildren = childPositions.map((position, index) => (
        <div
            key={index}
            ref={el => {
                childRefs.current[index] = el;
            }}
            data-position-x={position.x}
            data-position-y={position.y}
            data-child-index={index} // Добавляем индекс для идентификации
        >
            <TableComponent header={`table_${index}`} />
        </div>
    ));
//<button style={{zIndex: 2, position: 'absolute'}} onClick={addChild}>add</button>
    return (
        <div>
            <LeftBar children={[
                <LeftBarButton
                    key={0}
                    name={'Добавить таблицу'}
                    action={addChild}
                    icon={FaPlusCircle}
                />
            ]}/>
            <GridComponent
                ref={gridRef}
                children={gridChildren}
                onChildDrag={handleChildDrag} // Передаем обработчик
            />
        </div>
    )
}

export default GridPage;