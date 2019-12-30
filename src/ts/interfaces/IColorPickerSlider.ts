export interface IColorPickerSlider {
    /** X positition */
    x: number;

    /** Check if mouse is down */
    mouseDown: boolean;

    /** Update the slider handler position */
    update(): void;
}
