export interface IColorPickerHandle {
    /** X position */
    x: number;
    /** Y position */
    y: number;

    /** Check if mouse is down */
    mouseDown: boolean;

    /** Update the handler position */
    update(): void;
}
