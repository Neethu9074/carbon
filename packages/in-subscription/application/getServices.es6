// @flow

import createSubscription from 'in-subscription/subscription';
import type { ServiceItem } from 'in-types/application';
import type { Observable } from 'reactive-observables';
import { deepFreeze } from 'in-services/util/object';
import 'in-subscription/subscription';

export type GetServicesQuery = {};

const subscriptionFactory: GetServicesQuery => Observable<Result<PaginatedResult<ServiceItem>>> = createSubscription({
  eventId: 'get-services',

  getId() {
    return 'some-weird-string';
  },

  getData(subscriptionId) {
    return {
      subscriptionId,
      pagination: null,
      orderBy: null,
      metrics: null
    };
  },

  transform(observable): Observable<Result<PaginatedResult<ServiceItem>>> {
    const result = observable.map(deepFreeze);
    return (result: Observable<any>);
  }
});

export default subscriptionFactory;
