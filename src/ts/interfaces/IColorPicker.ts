import { IColorPickerHandle } from './IColorPickerHandle';
import { IColorPickerSlider } from './IColorPickerSlider';

export interface IColorPicker {
    /** Initialized */
    initialized: boolean;

    /** Is shown */
    shown: boolean;

    /** Permission to close */
    allowClose: boolean;

    /** Context for picker */
    pickerCTX: CanvasRenderingContext2D;
    /** Context for slider */
    sliderCTX: CanvasRenderingContext2D;
    /** Picker manager */
    picker: IColorPickerHandle;
    /** Slider manager */
    slider: IColorPickerSlider;

    /** Picked color */
    color: string;

    /** Callback after the color was chosen */
    callback: any;

    /** Initialize dialog */
    init(): void;

    /**
     * Open dialog
     * @param callback callback with parameter of chosen color
     */
    open(callback: any): void;

    /** Key handler */
    keyHandler(ev: KeyboardEvent): void;

    /**
     * Update selected color with chosen color
     * @param color color
     */
    updatePickerCTX(color: string): void;

    /**
     * Update the picker with color after slider
     * @param color color
     */
    updatePickerDIV(color: string): void;

    /** Check if allowed to close */
    checkClose(): void;

    /** Close dialog */
    close(): void;
}
