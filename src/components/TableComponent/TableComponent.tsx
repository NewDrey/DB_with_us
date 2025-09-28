import React from "react";
import './TableComponent.scss'
import {useTheme} from "../../hooks/useTheme";
import store from "../../ts/store";

interface TableComponentProps {
    header?: string;
}

// Визуальный элемент таблицы
const TableComponent: React.FC<TableComponentProps> = ({
                                                      header = 'Table'
                                                  }) => {

    useTheme()
    const headerBackGround = store.getters.getTheme('tableHeaderColor');
    return (
        <div className='tableDiv'>
            <div className='headerBackGround' style={{backgroundColor: headerBackGround}}>
                {header}
            </div>
            <div style={{ padding: '10px' }}>
                Содержимое таблицы...
            </div>
        </div>
    )
}

export default TableComponent