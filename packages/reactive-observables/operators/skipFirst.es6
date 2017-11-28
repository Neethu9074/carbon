import Observer from '../Observer';

export default function skipFirst() {
  const observer = Object.create(Observer);
  let callCount = 0;

  observer._init(this, this._observableSpec, data => {
    if (callCount === 0) {
      callCount++;
      return;
    }
    observer._emit(data);
  });

  return observer;
}
