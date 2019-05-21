// @flow
import TerminalObserver from '../TerminalObserver';
import type { Observable } from '../Observable';
import Subject from '../Subject';

export interface Transformer<Source, Target> {
  emitLatestOnSubscribe: boolean;
  shouldRetransform: (?Source, ?Source) => boolean;
  transform: (?Source) => Observable<Target>;
}

export default function transform<Source, Target>(transformer: Transformer<Source, Target>): Observable<Target> {
  const sourceObservable: Observable<Source> = this;

  let previousSourceValue: ?Source;
  let sourceObservableSubscription: ?TerminalObserver<Source>;
  let intermediateObservableSubscription: ?TerminalObserver<Target>;

  const targetObservable: Subject<Target> = new Subject({
    emitLatestOnSubscribe: transformer.emitLatestOnSubscribe !== false,
    start,
    stop
  });
  return targetObservable;

  function start() {
    sourceObservableSubscription = sourceObservable.subscribe(
      (value: ?Source): void => {
        // Reset last emitted value on every source observable change to avoid
        // sending stable data to subscribers on emit on subscribe.
        targetObservable._lastEmittedValue = undefined;

        // it should be possible to avoid retransforms
        if (
          previousSourceValue !== undefined &&
          transformer.shouldRetransform &&
          !transformer.shouldRetransform(previousSourceValue, value)
        ) {
          return;
        }

        previousSourceValue = value;

        // dispose previous intermediate observable subscription because we are
        // gettering a new observable from the transformer function.
        //
        // Only do this once the new subscription has been established to allow
        // observable reference counting. If we would dispose the old subscription
        // beforehand, we would run the risk of stopping the intermediate
        // observable. Restarting it can be a potentially expensive operation.
        const previousIntermediateObservableSubscription = intermediateObservableSubscription;

        const intermediateObservable: Observable<Target> = transformer.transform(value);
        intermediateObservableSubscription = intermediateObservable.subscribe(v => targetObservable.emit(v));

        if (previousIntermediateObservableSubscription) {
          previousIntermediateObservableSubscription.dispose();
        }
      }
    );
  }

  function stop() {
    // it may happen that the side effect of subscribing to the parent
    // cause the child to unsubscribe. Sounds weird, but is actually
    // a valid outcome.
    if (sourceObservableSubscription) {
      sourceObservableSubscription.dispose();
      sourceObservableSubscription = null;
    }

    // This subscription may not exist, when transform subscription is disposed
    // before the source observable emits for the first time.
    if (intermediateObservableSubscription) {
      intermediateObservableSubscription.dispose();
      intermediateObservableSubscription = null;
    }
  }
}
