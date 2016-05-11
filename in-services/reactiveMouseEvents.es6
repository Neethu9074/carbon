import * as ro from 'reactive-observables';

import {getIn} from 'in-services/settings';


export function onWheel(domElement, callback) {

  return ro.combineLatest([
    getIn(['map', 'scrollSpeed']),
    getIn(['map', 'scrollDirection']),
     ro.on(domElement, 'wheel')
       .throttle(50)
  ])
  .subscribe(props => {
   callback({
     scrollSpeed: props[0],
     scrollDirection: props[1],
     deltaY: props[2].deltaY,
     rawEvent: props[2]
   });
 });
}


export function onMove(domElement, callback) {
  return ro.on(domElement, 'mousemove')
           .subscribe(callback);
}

export function onDown(domElement, callback) {
  return ro.on(domElement, 'mousedown')
           .subscribe(callback);
}

export function onUp(domElement, callback) {
  return ro.on(domElement, 'mouseup')
           .subscribe(callback);
}

export function onLeave(domElement, callback) {
  return ro.on(domElement, 'mouseleave')
           .subscribe(callback);
}
