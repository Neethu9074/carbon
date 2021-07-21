/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import { onStart, onStop, onData } from 'in-services/tracking/ineum/resultSubscriptionStatsTracking';
import { TtiGenerator } from 'in-services/util/memoizingObservableGenerator';
import { defaultMemoize } from 'in-subscription/subscriptionMemoization';
import createSubscription from 'in-subscription/subscription';
import { pendingResult } from 'in-services/fixedObjects';
import { deepFreeze } from 'in-services/util/object';
import { Result } from 'in-types/backend';

export interface Options<IN, OUT> {
  eventId: string;
  mapResult?: (result: Object) => OUT;
  memoizeFor?: number | TtiGenerator<IN, OUT>;
  disposeSubscriptionOnDocumentHidden?: boolean;
  trackSubscriptionStatistics?: boolean;
}

export function createResultSubscriptionFactory<IN, OUT extends Result<any>>({
  eventId,
  mapResult,
  memoizeFor = defaultMemoize,
  disposeSubscriptionOnDocumentHidden = true,
  trackSubscriptionStatistics = false
}: Options<IN, OUT>) {
  return createSubscription<IN, OUT>({
    eventId,
    memoizeFor,
    disposeSubscriptionOnDocumentHidden,

    getData(subscriptionId, params) {
      return {
        subscriptionId,
        ...params
      };
    },

    transform(observable) {
      if (mapResult) {
        observable = observable.map(mapResult);
      }
      return observable.map(deepFreeze).startWith(pendingResult) as Observable<OUT>;
    },

    onStart: trackSubscriptionStatistics ? onStart : undefined,
    onStop: trackSubscriptionStatistics ? onStop : undefined,
    onData: trackSubscriptionStatistics ? onData : undefined
  });
}
