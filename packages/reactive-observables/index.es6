// @flow
import Observable, { ObservableSpec } from './Observable';
import Observer from './Observer';
import { applyOperators } from './operators';
import { setHandler } from './unhandledErrorSink';

applyOperators(Observer);
applyOperators(Observable);

export const setUnhandledErrorHandler = setHandler;

export function create<T>(observableSpec: ?ObservableSpec<T>): Observable<T> {
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

export function interval(millis: number): Observable<number> {
  let localTimeIntervalHandle;
  return create({
    start(observable): void {
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

export function timeout(millis: number): Observable<number> {
  let handle: number;
  return create({
    start(observable: Observable<number>) {
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

export function combineLatest<T>(observables: Observable<T>[], waitForAll: boolean = true): Observable<Array<T>> {
  if (observables.length === 0) {
    const emptyArrayObservable: Observable<Array<T>> = create();
    emptyArrayObservable.emit([]);
    return emptyArrayObservable;
  }

  const numberOfObservables = observables.length;
  let subscriptions = [];
  let emitted = [];
  let combinedObservables: Observable<Array<T>> = create({ start, stop, emitLatestOnSubscribe: true });
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

export function on(target: any, event: any, options: any): Observable<any> {
  const observable: Observable<any> = create({ start, stop, emitLatestOnSubscribe: true });
  return observable;

  function listener(e: any) {
    observable.emit(e);
  }

  function start() {
    target.addEventListener(event, listener, options);
  }

  function stop() {
    target.removeEventListener(event, listener, options);
  }
}
