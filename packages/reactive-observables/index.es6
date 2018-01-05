// @flow
import Observable, { ObservableSpec } from './Observable';
import Observer from './Observer';
import { applyOperators } from './operators';
import { setHandler } from './unhandledErrorSink';

applyOperators(Observer);
applyOperators(Observable);

export const setUnhandledErrorHandler = setHandler;

export function create(observableSpec: ?ObservableSpec) {
  if (!observableSpec) {
    observableSpec = {
      start: () => {},
      stop: () => {},
      emitLatestOnSubscribe: true
    };
  }
  if (observableSpec.emitLatestOnSubscribe !== false) {
    observableSpec.emitLatestOnSubscribe = true;
  }
  return new Observable(observableSpec);
}

export function interval(millis: number) {
  let localTimeIntervalHandle;
  return create({
    start(observable: Observable): void {
      localTimeIntervalHandle = setInterval(() => {
        observable.emit(Date.now());
      }, millis);
    },

    stop(): void {
      clearInterval(localTimeIntervalHandle);
    },

    emitLatestOnSubscribe: true
  });
}

export function timeout(millis: number) {
  let handle;
  return create({
    start(observable: Observable) {
      handle = setTimeout(() => {
        observable.emit(Date.now());
      }, millis);
    },

    stop() {
      clearTimeout(handle);
    },

    emitLatestOnSubscribe: true
  });
}

export function combineLatest(observables: Observable[], waitForAll: boolean = true) {
  if (observables.length === 0) {
    const emptyArrayObservable = create();
    emptyArrayObservable.emit([]);
    return emptyArrayObservable;
  }

  const numberOfObservables = observables.length;
  let combinedObservables;
  let subscriptions = [];
  let emitted = [];

  combinedObservables = create({ start, stop, emitLatestOnSubscribe: true });
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

export function on(target: any, event: any, options: any) {
  const observable = create({ start, stop, emitLatestOnSubscribe: true });
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
