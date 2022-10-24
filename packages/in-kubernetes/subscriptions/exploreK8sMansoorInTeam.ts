/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { KubernetesExploreQuery } from 'in-kubernetes/subscriptions/exploreKubernetes';
import createSubscription from 'in-subscription/subscription';
import { Result } from 'in-types';

export default createSubscription<KubernetesExploreQuery, Result<any>>({
  eventId: 'exploreK8sMansoorInTeam'
});
