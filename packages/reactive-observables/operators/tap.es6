// @flow
import Observer from '../Observer';

export default function tap(tapper: (data: any) => any): Observer {
  const observer = new Observer(this, this._observableSpec);
  return observer._setOnNext(data => {
    tapper(data);
    observer._emit(data);
  });
}
