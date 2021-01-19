/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { combineLatest, on } from '@instana/observables';

import { getSetting$ } from 'in-services/settings';

export function onWheel(domElement, callback) {
  return combineLatest([
    getSetting$('map_scrollSpeed').startWith(1),
    getSetting$('map_scrollDirection').startWith(1),
    on(domElement, 'wheel', { passive: true }).throttle(50)
  ]).subscribe(props => {
    const event = props[2];

    if (event.deltaY === 0) {
      return;
    }
    const eventScrollDir = event.deltaY <= 0 ? -1 : 1;
    const userScrollDir = props[1];

    callback({
      scrollSpeed: props[0],
      scrollDirection: eventScrollDir * userScrollDir,
      rawEvent: event
    });
  });
}

export function onMove(domElement, callback) {
  return on(domElement, 'mousemove').subscribe(callback);
}

export function onDown(domElement, callback) {
  return on(domElement, 'mousedown').subscribe(callback);
}

export function onUp(domElement, callback) {
  return on(domElement, 'mouseup').subscribe(callback);
}

export function onLeave(domElement, callback) {
  return on(domElement, 'mouseleave').subscribe(callback);
}

export function onEnter(domElement, callback) {
  return on(domElement, 'mouseenter').subscribe(callback);
}
