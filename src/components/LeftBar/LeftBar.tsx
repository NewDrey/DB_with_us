import React from "react";
import {LeftBarProps} from "./types/types";
import './LeftBar.scss'


const LeftBar:  React.FC<LeftBarProps> = ({
                            children
                                          }) => {
    return (
        <div className='leftMainEl'>
            {children}
        </div>
    )
}
export default LeftBar