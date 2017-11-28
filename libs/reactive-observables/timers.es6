/* global global:false */

const originalSetTimeout = getGlobal('setTimeout');
const originalClearTimeout = getGlobal('clearTimeout');

let chosenSetTimeout = originalSetTimeout;
let chosenClearTimeout = originalClearTimeout;

export function setTimeoutFn() {
  return chosenSetTimeout.apply(this, arguments);
}

export function setSetTimeoutFn(_setTimeoutFn) {
  chosenSetTimeout = _setTimeoutFn;
}

export function clearTimeoutFn() {
  return chosenClearTimeout.apply(this, arguments);
}

export function setClearTimeoutFn(_clearTimeoutFn) {
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
