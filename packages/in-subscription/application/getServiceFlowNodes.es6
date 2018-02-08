// @flow

import type { ServiceFlowNode, GetServiceFlowArgs } from 'in-types/application';
import createSubscription from 'in-subscription/subscription';
import { pendingResult } from 'in-services/fixedObjects';
import type { Observable } from 'reactive-observables';
import { deepFreeze } from 'in-services/util/object';
import 'in-subscription/subscription';

const subscriptionFactory: GetServiceFlowArgs => Observable<
  Result<PaginatedResult<ServiceFlowNode>>
> = createSubscription({
  eventId: 'getServiceFlowNodes',

  getData(subscriptionId, params) {
    return {
      subscriptionId,
      ...params
    };
  },

  transform(observable): Observable<Result<PaginatedResult<ServiceFlowNode>>> {
    const result = observable.map(deepFreeze).startWith(pendingResult);
    return (result: Observable<any>);
  }
});

export default subscriptionFactory;
