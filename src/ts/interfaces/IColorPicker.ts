import { IColorPickerHandle } from './IColorPickerHandle';
import { IColorPickerSlider } from './IColorPickerSlider';

export interface IColorPicker {
    initialized: boolean;
    shown: boolean;
    allowClose: boolean;
    pickerCTX: CanvasRenderingContext2D;
    sliderCTX: CanvasRenderingContext2D;
    picker: IColorPickerHandle;
    slider: IColorPickerSlider;

    color: string;
    callback: any;

    init(): void;
    open(callback: any): void;
    keyHandler(ev: KeyboardEvent): void;
    updatePickerCTX(color: string): void;
    updatePickerDIV(color: string): void;
    checkClose(): void;
    close(): void;
};
