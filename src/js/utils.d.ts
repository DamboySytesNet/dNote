declare const DefaultColors: string[];
/**
 * Convert dec to hex
 * @param dec number to convert
 * @param format number min characters to return
 */
declare function decToHex(dec: number, format: number): string;
/**
 * Custom id selector
 * @param id id of the searched element
 */
declare function $id(id: string): HTMLElement;
/**
 * Randomize integers from given range
 */
declare function randomize(min: number, max: number): number;
/**
 * Gets words from HTMLElement
 * @param el element from which content is read
 */
declare function getTextFromDOM(el: HTMLElement | ChildNode): string;
