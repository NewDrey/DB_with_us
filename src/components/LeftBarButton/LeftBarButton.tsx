import React from "react";
import { IconType } from 'react-icons';
import './LeftBarButton.scss'

interface LeftBarButtonProps {
    name: string;
    action: () => void;
    icon: IconType;
}

const LeftBarButton: React.FC<LeftBarButtonProps> = ({
                                                         name,
                                                         action,
                                                         icon: IconComponent
                                                     }) => {
    const Icon = IconComponent as React.ElementType;

    return (
        <div className='leftBarButton' onClick={action}>
            <Icon size={30} />
            <span>{name}</span>
        </div>
    )
}

export default LeftBarButton;