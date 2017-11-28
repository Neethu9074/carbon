import Observer from '../Observer';

export default function errors() {
  const observer = Object.create(Observer);

  observer._init(
    this,
    this._observableSpec,
    () => {},
    error => {
      observer._emit(error);
    }
  );

  return observer;
}
