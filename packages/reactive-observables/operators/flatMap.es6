// @flow
import Observable from '../Observable';

export default function flatMap<T>(flatMapper: T => T): Observable {
  return this.transform({
    transform: flatMapper
  });
}
