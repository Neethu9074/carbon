// @flow
import createSubscription from 'in-subscription/subscription';
import Observable from 'reactive-observables/Observable';
import type { ServiceItem } from 'in-types/application';
import 'in-subscription/subscription';

const subscriptionFactory: void => Observable<Result<PaginatedResult<ServiceItem>>> = createSubscription({
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
  }
});

export default subscriptionFactory;
