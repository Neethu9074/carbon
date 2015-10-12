import * as ro from 'reactive-observables';

// This observable can be used for cases where we want to emit always null.
export const alwaysNullObservable = ro.create({emitLatestOnSubscribe: true});
alwaysNullObservable.emit(null);
