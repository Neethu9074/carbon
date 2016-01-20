import * as ro from 'reactive-observables';

export const alwaysNull = ro.create().emit(null).freeze();
export const alwaysEmptyArray = ro.create().emit(freeze([])).freeze();

let currentTimeIntervalHandle;
export const currentTime = ro.create({
  start(observable) {
    observable.emit(Date.now());
    currentTimeIntervalHandle = setInterval(() => {
      observable.emit(Date.now());
    }, 1000);
  },

  stop() {
    clearInterval(currentTimeIntervalHandle);
  }
}).freeze();

function freeze(v) {
  Object.freeze(v);
  return v;
}
