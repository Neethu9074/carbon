// @flow
import Observable from '../Observable';

export default function merge<E>(): Observable<E> {
  const args: Array<Observable<E>> = arguments;
  const subscriptions = [];
  const sourceObservable: Observable<E> = this;

  const targetObservable: Observable<E> = new Observable({
    start,
    stop,
    emitLatestOnSubscribe: this._observableSpec.emitLatestOnSubscribe
  });
  return targetObservable;

  function start() {
    subscriptions.push(sourceObservable.subscribe(pushToTarget));
    for (let i = 0, len = args.length; i < len; i++) {
      subscriptions.push(args[i].subscribe(pushToTarget));
    }

    if (targetObservable._children.length === 0) {
      stop();
    }
  }

  function pushToTarget(e) {
    targetObservable.emit(e);
  }

  function stop() {
    const previousSubscriptions = subscriptions.slice();
    subscriptions.length = 0;
    for (let i = 0, len = previousSubscriptions.length; i < len; i++) {
      previousSubscriptions[i].dispose();
    }
  }
}
