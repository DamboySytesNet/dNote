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
