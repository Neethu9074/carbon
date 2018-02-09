// @flow
import Observer from '../Observer';

export default function flatMap<C, E>(flatMapper: (?C) => E): Observer<C, E> {
  return this.transform({
    transform: flatMapper
  });
}
