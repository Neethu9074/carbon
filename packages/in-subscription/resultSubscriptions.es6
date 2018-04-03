import createSubscription from 'in-subscription/subscription';
import { pendingResult } from 'in-services/fixedObjects';
import { deepFreeze } from 'in-services/util/object';
import { always } from 'in-services/fixedStreams';
import 'in-subscription/subscription';

const conditions = new Map();

export function clearConditions() {
  conditions.clear();
}

export function setConditions(newConditions) {
  for (let i = 0; i < newConditions.length; i++) {
    const newCondition = newConditions[i];
    conditions.set(newCondition.eventId, newCondition);
  }
}

export function createResultSubscriptionFactory({ eventId, disposeSubscriptionOnDocumentHidden = false }) {
  return params => {
    if (matchesCondition(eventId)) {
      return handleCondition(eventId, params);
    }

    return createSubscription({
      eventId,
      disposeSubscriptionOnDocumentHidden,

      getData(subscriptionId, params) {
        return {
          subscriptionId,
          ...params
        };
      },

      transform(observable) {
        return observable.map(deepFreeze).startWith(pendingResult);
      }
    })(params);
  };
}

function matchesCondition(eventId) {
  return conditions.size > 0 && conditions.has(eventId);
}

function handleCondition(eventId, params) {
  const conditionForEventId = conditions.get(eventId);
  if (conditionForEventId.requestDummyLoadingData) {
    return always(
      deepFreeze({
        progress: { loading: true },
        errors: []
      })
    );
  }
  if (conditionForEventId.requestDummyErrorData) {
    return always(
      deepFreeze({
        progress: { loading: false },
        errors: [{ message: 'Something went wrong.' }, { message: 'This should also not happen.' }]
      })
    );
  }
  return always(
    deepFreeze({
      progress: { loading: false },
      errors: [],
      data: conditionForEventId.getDummyData(params)
    })
  );
}
