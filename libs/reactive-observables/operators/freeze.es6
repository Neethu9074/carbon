import Observer from '../Observer';

export default function freeze() {
  const observer = Object.create(Observer);

  observer._init(this, this._observableSpec, data => {
    observer._emit(data);
  });

  return observer;
}
