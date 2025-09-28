import React from "react";
import {LeftBarProps} from "./types/types";
import {useTheme} from "../../hooks/useTheme";
import store from "../../ts/store";
import './LeftBar.scss'


const LeftBar:  React.FC<LeftBarProps> = ({
                            children
                                          }) => {
    useTheme()
    const bgColor = store.getters.getTheme('leftBarBackground');
    return (
        <div className='leftMainEl' style={{backgroundColor: bgColor}}>
            {children}
        </div>
    )
}
export default LeftBar