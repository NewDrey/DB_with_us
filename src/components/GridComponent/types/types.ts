import React from "react";

export interface DragState {
    isDragging: boolean;
    childIndex: number | null;
    startLogicalX: number;
    startLogicalY: number;
    startMouseX: number;
    startMouseY: number;
}

export interface GridState {
    position: { x: number; y: number };
    scale: number;
    isDragging: boolean;
    lastMousePos: { x: number; y: number };
}

export interface ChildWithPositionProps {
    'data-position-x'?: string | number;
    'data-position-y'?: string | number;
    'data-child-index'?: string | number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onMouseDown?: (e: React.MouseEvent) => void;
}

export interface GridProps {
    gridSize?: number;
    children?: React.ReactNode[];
    onChildDrag?: (index: number, logicalX: number, logicalY: number) => void;
}