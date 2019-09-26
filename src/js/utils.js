"use strict";
/**
 * Custom id selector
 * @param id id of the searched element
 */
function $id(id) {
    return document.getElementById(id);
}
/**
 * Randomize integers from given range
 */
function randomize(min, max) {
    if (max < min)
        return 0;
    return Math.floor(Math.random() * ((max - min) + 1)) + min;
}
/**
 * Gets words from HTMLElement
 * @param el element from which content is read
 */
function getTextFromDOM(el) {
    let ret = '';
    const length = el.childNodes.length;
    for (let i = 0; i < length; i++) {
        let node = el.childNodes[i];
        ret += ' ';
        if (node.nodeType !== 8)
            ret += node.nodeType !== 1 ? node.nodeValue : getTextFromDOM(node);
    }
    return ret.substr(0, 1) === ' ' ? ret.substr(1) : ret;
}
