// @flow
import Observer from '../Observer';

export default function freeze(): Observer {
  const observer = new Observer(this, this._observableSpec);
  return observer._setOnNext(data => {
    observer._emit(data);
  });
}
