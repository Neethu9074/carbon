/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result } from '@instana/types';

import { ExploreClusterQuery, ExploreClusterResponse } from 'in-kubernetes/subscriptions/exploreKubernetes';
import createSubscription from 'in-subscription/subscription';

export default createSubscription<ExploreClusterQuery, Result<ExploreClusterResponse>>({
  eventId: 'exploreClusters'
});
