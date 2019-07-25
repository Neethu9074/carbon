// @flow
import type { Observable } from '../Observable';
import Subject from '../Subject';

export default function merge<E>(): Observable<E> {
  const args: Array<Observable<E>> = arguments;
  const subscriptions = [];
  const sourceObservable: Observable<E> = this;

  const targetObservable: Subject<E> = new Subject({
    start,
    stop,
    emitLatestOnSubscribe: this._subjectSpec.emitLatestOnSubscribe
  });
  return targetObservable;

  function start() {
    subscriptions.push(sourceObservable.subscribe(pushToTarget, pushErrorToTarget));
    for (let i = 0; i < args.length; i++) {
      subscriptions.push(args[i].subscribe(pushToTarget, pushErrorToTarget));
    }

    if (targetObservable._children.length === 0) {
      stop();
    }
  }

  function pushToTarget(e) {
    targetObservable.emit(e);
  }

  function pushErrorToTarget(e) {
    targetObservable.emitError(e);
  }

  function stop() {
    const previousSubscriptions = subscriptions.slice();
    subscriptions.length = 0;
    for (let i = 0, len = previousSubscriptions.length; i < len; i++) {
      previousSubscriptions[i].dispose();
    }
  }
}
