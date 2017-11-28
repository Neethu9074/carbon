import Observable from './Observable';
import Observer from './Observer';
import { applyOperators } from './operators';
import { setHandler } from './unhandledErrorSink';

applyOperators(Observer);
applyOperators(Observable);

export const setUnhandledErrorHandler = setHandler;

export function create(observableSpec) {
  observableSpec = observableSpec || {};
  if (observableSpec.emitLatestOnSubscribe !== false) {
    observableSpec.emitLatestOnSubscribe = true;
  }
  const observable = Object.create(Observable);
  observable._init(observableSpec);
  return observable;
}

export function interval(millis) {
  let localTimeIntervalHandle;
  return create({
    start(observable) {
      localTimeIntervalHandle = setInterval(() => {
        observable.emit(Date.now());
      }, millis);
    },

    stop() {
      clearInterval(localTimeIntervalHandle);
    }
  });
}

export function timeout(millis) {
  let handle;
  return create({
    start(observable) {
      handle = setTimeout(() => {
        observable.emit(Date.now());
      }, millis);
    },

    stop() {
      clearTimeout(handle);
    }
  });
}

export function combineLatest(observables, waitForAll = true) {
  if (observables.length === 0) {
    const emptyArrayObservable = create();
    emptyArrayObservable.emit([]);
    return emptyArrayObservable;
  }

  const numberOfObservables = observables.length;
  let combinedObservables;
  let subscriptions = [];
  let emitted = [];

  combinedObservables = create({ start, stop });
  return combinedObservables;

  function start() {
    subscriptions = observables.map((o, i) => {
      return o.subscribe(data => {
        emitted[i] = data;
        checkWhetherAllObservablesEmitted();
      });
    });
  }

  function stop() {
    subscriptions.forEach(s => s.dispose());
    emitted = [];
  }

  function checkWhetherAllObservablesEmitted() {
    if (waitForAll) {
      for (let i = 0; i < numberOfObservables; i++) {
        if (emitted[i] === undefined) {
          return;
        }
      }
    }
    combinedObservables.emit(emitted);
  }
}

export function on(target, event, options) {
  const observable = create({ start, stop });
  return observable;

  function listener(e) {
    observable.emit(e);
  }

  function start() {
    target.addEventListener(event, listener, options);
  }

  function stop() {
    target.removeEventListener(event, listener, options);
  }
}
