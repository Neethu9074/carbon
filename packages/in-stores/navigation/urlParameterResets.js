/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
let resets = [];

export function addReset(fn) {
  resets.push(fn);
}

export function removeReset(fn) {
  resets = resets.filter(f => f != fn);
}

export function applyResets(previousLocation, nextLocation) {
  resets.forEach(reset => reset(previousLocation, nextLocation));
}
