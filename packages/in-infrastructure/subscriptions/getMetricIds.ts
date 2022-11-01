/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetMetricIdsQuery, Result } from '@instana/types';

import createSubscription from 'in-subscription/subscription';

export default createSubscription<GetMetricIdsQuery, Result<string[]>>({
  eventId: 'infrastructure.getMetricIds'
});
