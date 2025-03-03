/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Result } from '@instana/types';

import { KubernetesExploreQuery } from 'in-kubernetes/subscriptions/exploreKubernetes';
import createSubscription from 'in-subscription/subscription';

export default createSubscription<KubernetesExploreQuery, Result<any>>({
  eventId: 'exploreK8sNateInTeam'
});
