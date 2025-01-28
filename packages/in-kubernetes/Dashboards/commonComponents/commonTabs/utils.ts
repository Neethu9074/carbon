/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { KubernetesPodListItem } from '@instana/types';
import { KubernetesCondition } from '@instana/types';

interface GetHealthyStatusProps extends Omit<KubernetesPodListItem, 'pod'> {
  statusSummary: string;
  podConditions: KubernetesCondition[];
}

export function getHealthyStatus({
  podConditions,
  entityHealthInfo: { openIssues, maxSeverity: baseMaxSeverity },
  statusSummary
}: GetHealthyStatusProps) {
  const statusSuccess = ['running', 'completed', 'pending', 'created', 'started', 'succeeded'];
  const isOpenIssues = (typeof openIssues === 'number' && openIssues === 0) || openIssues.length === 0;
  const isStatusDefined = statusSuccess.includes(statusSummary?.toLowerCase());
  const isStatusCompleted = statusSummary?.toLocaleLowerCase() === 'completed';

  const isConditionStatusFalseFound = podConditions?.some(
    (condition: KubernetesCondition) => condition.status.toLowerCase() === 'false'
  );

  const isNotHealthy = (isOpenIssues && !isStatusDefined) || (isConditionStatusFalseFound && !isStatusCompleted);

  const openIssuesCount = isNotHealthy ? 1 : openIssues.length ?? openIssues;
  const maxSeverity = isNotHealthy ? 10 : baseMaxSeverity;

  return {
    openIssuesCount,
    maxSeverity
  };
}
