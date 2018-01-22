// @flow
import { setHandler } from './unhandledErrorSink';
import type { Observable } from './Observable';
export type { Observable } from './Observable';
import type { SubjectSpec } from './Subject';
import { applyOperators } from './operators';
import Observer from './Observer';
import Subject from './Subject';

applyOperators(Observer);
applyOperators(Subject);

export const setUnhandledErrorHandler = setHandler;

export function create<T>(subjectSpec: ?SubjectSpec<T>): Subject<T> {
  if (!subjectSpec) {
    subjectSpec = {
      start: noop,
      stop: noop
    };
  }
  if (subjectSpec.emitLatestOnSubscribe !== false) {
    // $FlowFixMe: No clue why the write access does not type check although the read access one line above does.
    subjectSpec.emitLatestOnSubscribe = true;
  }
  return new Subject(subjectSpec);
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
    }
  });
}

export function timeout(millis: number): Observable<number> {
  let handle: number;
  return create({
    start(observable: Subject<number>) {
      handle = setTimeout(() => {
        observable.emit(Date.now());
      }, millis);
    },

    stop() {
      clearTimeout(handle);
    }
  });
}

export function combineLatest<T>(observables: Observable<T>[], waitForAll: boolean = true): Observable<Array<T>> {
  if (observables.length === 0) {
    const emptyArrayObservable: Subject<Array<T>> = create();
    emptyArrayObservable.emit([]);
    return emptyArrayObservable;
  }

  const numberOfObservables = observables.length;
  let subscriptions = [];
  let emitted = [];
  let combinedObservables: Subject<Array<T>> = create({ start, stop });
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
    combinedObservables.emit(emitted.slice());
  }
}

export function on(target: EventTarget, event: string, capture: EventListenerOptionsOrUseCapture): Observable<any> {
  const observable: Subject<Event> = create({ start, stop });
  return observable;

  function listener(e: any) {
    observable.emit(e);
  }

  function start() {
    target.addEventListener(event, listener, capture);
  }

  function stop() {
    target.removeEventListener(event, listener, capture);
  }
}

function noop() {
  // noop
}
