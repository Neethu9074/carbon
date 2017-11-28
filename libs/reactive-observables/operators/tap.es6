import Observer from '../Observer';

export default function tap(tapper) {
  const observer = Object.create(Observer);

  observer._init(this, this._observableSpec, data => {
    tapper(data);
    observer._emit(data);
  });

  return observer;
}
