import React from "react";
import './TableComponent.scss'

interface TableComponentProps {
    header?: string;
}

// Визуальный элемент таблицы
const TableComponent: React.FC<TableComponentProps> = ({
                                                      header = 'Table'
                                                  }) => {
    return (
        <div className='tableDiv'>
            <div className='headerBackGround'>
                {header}
            </div>
            <div style={{ padding: '10px' }}>
                Содержимое таблицы...
            </div>
        </div>
    )
}

export default TableComponent