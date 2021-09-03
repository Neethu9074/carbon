/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MutableRefObject, RefCallback } from 'react';

import { Nullish } from 'in-types';

export type Refs<T> = MutableRefObject<T | Nullish> | RefCallback<T | Nullish> | Nullish;

export function compositeRef<T>(...refs: Refs<T>[]): RefCallback<T> {
  return value => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}
