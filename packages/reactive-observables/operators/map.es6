import Observer from '../Observer';

export default function map(mapper) {
  const observer = Object.create(Observer);

  observer._init(this, this._observableSpec, data => {
    let val;

    try {
      val = mapper(data);
    } catch (e) {
      observer._emitError(e);
    }

    if (val !== undefined) {
      observer._emit(val);
    }
  });

  return observer;
}
