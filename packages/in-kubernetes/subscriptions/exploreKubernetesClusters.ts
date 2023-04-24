/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ExploreClusterQuery, ExploreClusterResponse } from 'in-kubernetes/subscriptions/exploreKubernetes';
import createSubscription from 'in-subscription/subscription';
import { Result } from 'in-types';

export default createSubscription<ExploreClusterQuery, Result<ExploreClusterResponse>>({
  eventId: 'exploreClusters'
});
