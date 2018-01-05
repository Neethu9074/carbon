// @flow
import Observer from '../Observer';

export default function errors(): Observer {
  const observer = new Observer(this, this._observableSpec);
  return observer
    ._setOnNext(() => {
    })
    ._setOnError(error => {
        observer._emit(error);
      }
    );
}
