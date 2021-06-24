/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { generateStableHash } from '@instana/utils';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'getInternalEvents',

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
