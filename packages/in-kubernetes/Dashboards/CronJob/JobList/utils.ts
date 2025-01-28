/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Cursor, TimeConfig } from '@instana/types';

// @ts-expect-error
import getKubernetesJobs from 'in-kubernetes/subscriptions/getKubernetesJobs';
import { getInfraGranularity } from 'in-stores/metric/metric';

interface GetTableDataProps {
  query: string;
  retrievalSize: number;
  orderBy: string;
  orderDirection: string;
  timeConfig: TimeConfig;
  clusterId?: string;
  namespaceId?: string;
  cronJobId?: string;
  cursor?: Cursor | null;
}

export function getTableData({
  query = '',
  cursor = null,
  retrievalSize = 20,
  orderBy = 'age',
  orderDirection = 'ASC',
  timeConfig,
  clusterId,
  namespaceId,
  cronJobId
}: GetTableDataProps) {
  return getKubernetesJobs({
    pagination: {
      cursor,
      retrievalSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      clusterId,
      namespaceId,
      cronJobId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
