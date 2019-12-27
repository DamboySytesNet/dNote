import { IColorPicker } from './interfaces/IColorPicker';

import { $id } from './utils';

export const ColorPicker: IColorPicker = {
    initialized: false,
    shown: false,
    allowClose: true,
    pickerCTX: null,
    sliderCTX: null,
    color: null,

    callback: null,

    picker: {
        x: null,
        y: null,
        mouseDown: false,

        update() {
            $id('colorPicker-picker').style.top = `${this.y - 3}px`;
            $id('colorPicker-picker').style.left = `${this.x - 3}px`;

            let rgb = ColorPicker.pickerCTX.getImageData(this.x, this.y, 1, 1)
                .data;

            let color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
            ColorPicker.color = color;

            $id('colorPicker-picked').style.background = color;
        }
    },

    slider: {
        x: null,
        mouseDown: false,

        update() {
            $id('colorPicker-slider').style.left = `${this.x}px`;

            let rgb = ColorPicker.sliderCTX.getImageData(this.x, 20, 1, 1).data;
            ColorPicker.updatePickerCTX(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
            ColorPicker.updatePickerDIV(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);

            rgb = ColorPicker.pickerCTX.getImageData(
                ColorPicker.picker.x,
                ColorPicker.picker.y,
                1,
                1
            ).data;

            $id(
                'colorPicker-picked'
            ).style.background = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        }
    },

    init() {
        this.initialized = true;

        // Set up canvas
        const c_1 = $id('colorPicker-canvasChooser') as HTMLCanvasElement;
        this.pickerCTX = c_1.getContext('2d');

        const c_2 = $id('colorPicker-canvasSlide') as HTMLCanvasElement;
        this.sliderCTX = c_2.getContext('2d');

        let grd = this.sliderCTX.createLinearGradient(0, 0, 200, 0);
        grd.addColorStop(0, 'rgb(255, 0, 0)');
        grd.addColorStop(0.1666, 'rgb(255, 255, 0)');
        grd.addColorStop(0.3333, 'rgb(0, 255, 0)');
        grd.addColorStop(0.5, 'rgb(0, 255, 255)');
        grd.addColorStop(0.6666, 'rgb(0, 0, 255)');
        grd.addColorStop(0.8333, 'rgb(255, 0, 255)');
        grd.addColorStop(1, 'rgb(255, 0, 0)');
        this.sliderCTX.fillStyle = grd;
        this.sliderCTX.fillRect(0, 0, 200, 32);

        // Start color picker
        this.picker.x = 97;
        this.picker.y = 97;
        this.picker.update();

        this.slider.x = 0;
        this.slider.update();
        this.updatePickerCTX('rgb(255, 0, 0)');

        function pickerMouseEventHandler(ev: MouseEvent) {
            if (ColorPicker.picker.mouseDown) {
                if (
                    (<HTMLDivElement>ev.composedPath()[0]).id ===
                    'colorPicker-chooser'
                ) {
                    if (ev.offsetY > 0 && ev.offsetY <= 200)
                        ColorPicker.picker.y = ev.offsetY;
                    if (ev.offsetX > 0 && ev.offsetX <= 200)
                        ColorPicker.picker.x = ev.offsetX;

                    ColorPicker.picker.update();
                }
            }
        }

        function sliderMouseEventHandler(ev: MouseEvent) {
            if (ColorPicker.slider.mouseDown) {
                if (
                    (<HTMLDivElement>ev.composedPath()[0]).id ===
                    'colorPicker-slide'
                ) {
                    if (ev.offsetX > 0 && ev.offsetX <= 200) {
                        ColorPicker.slider.x = ev.offsetX;
                        ColorPicker.slider.update();
                    }
                }
            }
        }

        // Assign listeners
        $id('colorPicker-chooser').addEventListener('mousedown', ev => {
            ColorPicker.picker.mouseDown = true;
            pickerMouseEventHandler(ev);
        });

        document.body.addEventListener('mouseup', () => {
            ColorPicker.picker.mouseDown = false;
        });

        document.body.addEventListener('mousemove', ev => {
            pickerMouseEventHandler(ev);
        });

        $id('colorPicker-slide').addEventListener('mousedown', ev => {
            ColorPicker.slider.mouseDown = true;
            sliderMouseEventHandler(ev);
        });

        document.body.addEventListener('mouseup', () => {
            ColorPicker.slider.mouseDown = false;
        });

        document.body.addEventListener('mousemove', ev => {
            sliderMouseEventHandler(ev);
        });

        $id('colorPicker-dialogButton-abort').addEventListener(
            'click',
            ColorPicker.close
        );
    },

    open(callback) {
        if (!this.initialized) this.init();

        this.shown = true;

        this.callback = () => {
            ColorPicker.close();
            callback(ColorPicker.color);
        };

        $id('colorPicker-dialogButton-action').addEventListener(
            'click',
            this.callback
        );

        // Show
        $id('colorPicker').style.display = 'flex';
        setTimeout(() => {
            $id('colorPicker-content').style.opacity = '1';
            $id('colorPicker-content').style.transform = 'translateY(0px)';
        }, 100);
    },

    updatePickerCTX(color) {
        this.pickerCTX.clearRect(0, 0, 200, 200);

        this.pickerCTX.fillStyle = color;
        this.pickerCTX.fillRect(0, 0, 200, 200);

        let grd = this.pickerCTX.createLinearGradient(0, 0, 200, 0);
        grd.addColorStop(0, 'rgb(128, 128, 128)');
        grd.addColorStop(1, 'rgba(128, 128, 128, 0)');
        this.pickerCTX.fillStyle = grd;
        this.pickerCTX.fillRect(0, 0, 200, 200);

        grd = this.pickerCTX.createLinearGradient(0, 0, 0, 200);
        grd.addColorStop(0, 'rgb(255, 255, 255)');
        grd.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        grd.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
        grd.addColorStop(1, 'rgb(0, 0, 0)');
        this.pickerCTX.fillStyle = grd;
        this.pickerCTX.fillRect(0, 0, 200, 200);
    },

    updatePickerDIV(color: string) {
        let el = $id('colorPicker-chooser');
        el.style.background = color;
        el.style.backgroundImage = `-webkit-linear-gradient(
                                        top,
                                        rgb(255, 255, 255) 0%,
                                        rgba(255, 255, 255, 0) 50%,
                                        rgba(0, 0, 0, 0) 50%,
                                        rgb(0, 0, 0) 100%
                                    ), -webkit-linear-gradient(
                                        left,
                                        rgb(128, 128, 128) 0%,
                                        rgba(128, 128, 128, 0) 100%
                                    )`;
    },

    keyHandler(ev) {
        if (ev.key === 'Escape') {
            if (this.shown) this.close();
        } else if (ev.key === 'Enter') {
            $id('colorPicker-dialogButton-action').click();
        }
    },

    checkClose() {
        if (this.allowClose) this.close();
        else this.allowClose = true;
    },

    close() {
        this.shown = false;
        $id('colorPicker-dialogButton-action').removeEventListener(
            'click',
            this.callback
        );
        this.callback = null;
        $id('colorPicker').style.display = 'none';
        $id('colorPicker-content').style.opacity = '0';
        $id('colorPicker-content').style.transform = 'translateY(-20px)';
    }
};
