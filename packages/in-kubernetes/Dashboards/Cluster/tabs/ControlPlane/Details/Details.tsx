/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';

// @ts-expect-error
import getKubernetesClusterItemCounters from 'in-kubernetes/subscriptions/getKubernetesClusterItemCounters';
import DetailsList from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Details/DetailsList';
import { DetailsProps } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Details/types';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function Details({ clusterId, clusterInfos, timeConfig }: DetailsProps) {
  const counters: any =
    useObservable(
      getKubernetesClusterItemCounters({ clusterId, timeConfig }),
      Object.values({ clusterId, timeConfig })
    ) ?? pendingResult;
  let coverage = '-';
  const countersData = counters?.data;
  const isCountersDefined = countersData && countersData?.nodes != 0;
  if (isCountersDefined) {
    const { hosts, nodes } = countersData;
    const coverageRatio = ((hosts / nodes) * 100).toFixed(1);
    coverage = `${hosts} of ${nodes} - ${coverageRatio}%`;
  }

  const clusterInfosWithHost = [...clusterInfos, { key: 'Host Coverage', value: coverage }];

  return (
    <Card title={t('in-kubernetes:dashboards.details')}>
      <DetailsList clusterInfos={clusterInfosWithHost} clusterId={clusterId} />
    </Card>
  );
}
