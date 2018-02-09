/* global global:false */
// @flow

// these signatures might change with future flow updates, they can be copied from
// https://github.com/facebook/flow/blob/v{x.y.z}/lib/core.js (after substituting x, y, z, of course).
const originalSetTimeout: (callback: Function, ms?: number, ...args: Array<any>) => number = getGlobal('setTimeout');
const originalClearTimeout: (timeoutId?: number) => void = getGlobal('clearTimeout');

let chosenSetTimeout = originalSetTimeout;
let chosenClearTimeout = originalClearTimeout;

// eslint-disable-next-line no-unused-vars
export function setTimeoutFn(...args: Array<any>): number {
  return chosenSetTimeout.apply(this, arguments);
}

export function setSetTimeoutFn(_setTimeoutFn: (callback: any, ms?: number, ...args: Array<any>) => number) {
  chosenSetTimeout = _setTimeoutFn;
}

// eslint-disable-next-line no-unused-vars
export function clearTimeoutFn(...args: Array<any>): void {
  return chosenClearTimeout.apply(this, arguments);
}

export function setClearTimeoutFn(_clearTimeoutFn: (timeoutId?: number) => void) {
  chosenClearTimeout = _clearTimeoutFn;
}

function getGlobal(name) {
  // node.js
  if (typeof global !== 'undefined' && global[name]) {
    return global[name];
    // browser
  } else if (typeof window !== 'undefined' && window[name]) {
    return window[name];
    // worst case
  } else if (this && this[name]) {
    return this[name];
  }

  throw new Error('Could not find ' + name);
}
