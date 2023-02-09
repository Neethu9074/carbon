/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { PaginatedResult, GetKubernetesNamespacesQuery, KubernetesNamespace, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getKubernetesNamespaces = createResultSubscriptionFactory<
  GetKubernetesNamespacesQuery,
  Result<PaginatedResult<KubernetesNamespace>>
>({
  eventId: 'getKubernetesNamespaces'
});

export default getKubernetesNamespaces;
