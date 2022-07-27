/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { KubernetesExploreQuery } from 'in-kubernetes/subscriptions/exploreKubernetes';
import createSubscription from 'in-subscription/subscription';
import { Result } from 'in-types';

export default createSubscription<KubernetesExploreQuery, Result<any>>({
  eventId: 'explorePersistentVolumeClaims'
});
