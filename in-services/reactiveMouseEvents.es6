import * as ro from 'reactive-observables';


export function onWheel(domElement, callback) {
  return ro.on(domElement, 'wheel')
           .scan((aggregate, e) => {
              e.preventDefault();
              aggregate.deltaY += e.deltaY;
              return aggregate;
            }, { deltaY: 0 })
            .throttle(50)
            .subscribe(callback);
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
