interface IColorPicker {
    initialized: boolean;
    shown: boolean;
    allowClose: boolean;
    pickerCTX: CanvasRenderingContext2D;
    sliderCTX: CanvasRenderingContext2D;
    picker: IColorPickerHandle;
    slider: IColorPickerSlider;
    color: string;
    init(): void;
    open(callback: any): void;
    keyHandler(ev: KeyboardEvent): void;
    updatePickerCTX(color: string): void;
    updatePickerDIV(color: string): void;
    checkClose(): void;
    close(): void;
}
interface IColorPickerHandle {
    x: number;
    y: number;
    mouseDown: boolean;
    update(): void;
}
interface IColorPickerSlider {
    x: number;
    mouseDown: boolean;
    update(): void;
}
declare const ColorPicker: IColorPicker;
