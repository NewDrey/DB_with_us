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

export const getLogicalPosition = (
    physicalX: number,
    physicalY: number,
    position: { x: number; y: number },
    scale: number
) => {
    return {
        x: (physicalX - position.x) / scale,
        y: (physicalY - position.y) / scale
    };
};