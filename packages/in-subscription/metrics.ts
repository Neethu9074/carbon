/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import createSubscription from 'in-subscription/subscription';

/**
 * @deprecated In order to support variable poll rate in the UI this endpoint has been deprecated.
 * Please use the new endpoint 'subscribe-metrics-with-metadata' in @code metricsWithMetadata.ts
 */
export default createSubscription({
  eventId: 'subscribe-metrics',
  memoizeFor: 0 // because subscribers rely on more than just the latest value (and there is not an easy way to memoize all values of an observable)
});
