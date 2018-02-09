// @flow

import type { GetMetricsQuery } from 'in-types/application';
import createSubscription from 'in-subscription/subscription';
import { pendingResult } from 'in-services/fixedObjects';
import type { Observable } from 'reactive-observables';
import { deepFreeze } from 'in-services/util/object';
import 'in-subscription/subscription';

const subscriptionFactory: GetMetricsQuery => Observable<Result<TimestampedMetrics>> = createSubscription({
  eventId: 'getMetrics',

  getData(subscriptionId, params) {
    return {
      subscriptionId,
      ...params
    };
  },

  transform(observable): Observable<Result<TimestampedMetrics>> {
    const result = observable.map(deepFreeze).startWith(pendingResult);
    return (result: Observable<any>);
  }
});

export default subscriptionFactory;
