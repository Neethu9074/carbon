'use strict';

import Rx from 'rx';

export function combine(subscriptions) {
  return Rx.Observable.combineLatest(
    subscriptions,
    function() {
      const values = [];
      for (let i = 0; i < arguments.length; i++) {
        values[i] = arguments[i];
      }
      return values;
    }
  );
}
