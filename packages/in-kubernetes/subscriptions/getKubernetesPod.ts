/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetKubernetesPodQuery, KubernetesPod, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetKubernetesPodQuery, Result<KubernetesPod>>({
  eventId: 'getKubernetesPod'
});
