import debounce from './debounce';
import delayedStop from './delayedStop';
import distinct from './distinct';
import errors from './errors';
import filter from './filter';
import flatMap from './flatMap';
import freeze from './freeze';
import map from './map';
import merge from './merge';
import nextFrame from './nextFrame';
import once from './once';
import scan from './scan';
import skipFirst from './skipFirst';
import startWith from './startWith';
import startWithFn from './startWithFn';
import subscribe from './subscribe';
import tap from './tap';
import throttle from './throttle';
import transform from './transform';

export function applyOperators(constructorFunction) {
  // Fetch the prototype from the class constructor and monkey patch it with our reactive observable operators.
  const proto = constructorFunction.prototype;
  proto.debounce = debounce;
  proto.delayedStop = delayedStop;
  proto.distinct = distinct;
  proto.errors = errors;
  proto.filter = filter;
  proto.flatMap = flatMap;
  proto.freeze = freeze;
  proto.map = map;
  proto.merge = merge;
  proto.nextFrame = nextFrame;
  proto.once = once;
  proto.scan = scan;
  proto.skipFirst = skipFirst;
  proto.startWith = startWith;
  proto.startWithFn = startWithFn;
  proto.subscribe = subscribe;
  proto.tap = tap;
  proto.throttle = throttle;
  proto.transform = transform;
}
