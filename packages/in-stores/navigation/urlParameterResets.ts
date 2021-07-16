/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Location } from 'in-stores/navigation/types';

export type Reset = (previousLocation: Location, nextLocation: Location) => void;

let resets: Reset[] = [];

export function addReset(fn: Reset) {
  resets.push(fn);
}

export function removeReset(fn: Reset) {
  resets = resets.filter(f => f != fn);
}

export function applyResets(previousLocation: Location, nextLocation: Location) {
  resets.forEach(reset => reset(previousLocation, nextLocation));
}
