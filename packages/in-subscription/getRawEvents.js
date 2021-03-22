/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import createSubscription from 'in-subscription/subscription';
import { generateStableHash } from 'in-services/util/id';

export default createSubscription({
  eventId: 'getRawEvents',

  getId({ timeConfig, query, pagination, order }) {
    return (
      generateStableHash(timeConfig) +
      order.by +
      order.direction +
      Math.round(Date.now() / 2000) +
      query +
      generateStableHash(pagination.cursor) +
      pagination.retrievalSize
    );
  },

  memoizeFor: 100
});
