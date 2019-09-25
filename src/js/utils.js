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
