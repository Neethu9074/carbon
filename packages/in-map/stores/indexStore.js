/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { create } from '@instana/observables';

export const canvas$ = create();

export function setCanvas(newCanvas) {
  canvas$.emit(newCanvas);
}

export function clear() {
  canvas$.emit(null);
}

export const dimensions$ = create();

export let width = 0;
export let height = 0;

export function setDimensions(_width, _height) {
  width = _width;
  height = _height;

  dimensions$.emit({
    width,
    height
  });
}
