/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result } from '@instana/types';

import { KubernetesExploreQuery } from 'in-kubernetes/subscriptions/exploreKubernetes';
import createSubscription from 'in-subscription/subscription';

export default createSubscription<KubernetesExploreQuery, Result<any>>({
  eventId: 'explorePersistentVolumeClaims'
});
