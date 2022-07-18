/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import createSubscription from 'in-subscription/subscription';
import { KubernetesExploreQuery } from './exploreKubernetes';
import { Result } from '../../in-types';

export default createSubscription<KubernetesExploreQuery, Result<any>>({
  eventId: 'exploreK8sNateInTeam'
});
