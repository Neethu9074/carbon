/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { KubernetesClusterItemCounters, Result } from '@instana/types';
import { Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Tile, Stack } from '@instana/carbon';

// @ts-expect-error
import getKubernetesClusterItemCounters from 'in-kubernetes/subscriptions/getKubernetesClusterItemCounters';
import DetailsList from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Details/DetailsList';
import { DetailsProps } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Details/types';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

export default function Details({ clusterId, clusterInfos, timeConfig }: DetailsProps) {
  const counters: Result<KubernetesClusterItemCounters> =
    useObservable(
      getKubernetesClusterItemCounters({ clusterId, timeConfig }),
      Object.values({ clusterId, timeConfig })
    ) ?? pendingResult;

  let value = '-';
  const key = t('in-kubernetes:dashboards.hostCoverage');
  const countersData = counters?.data;
  const isCountersDefined = countersData && countersData?.nodes != 0;
  if (isCountersDefined) {
    const { hosts, nodes } = countersData;
    const coverageRatio = ((hosts / nodes) * 100).toFixed(1);
    value = `${hosts} of ${nodes} - ${coverageRatio}%`;
  }

  const clusterInfosWithHost = [...clusterInfos, { key, value }];

  return (
    <Stack gap={5}>
      <Typography variant="heading-02" noMargin>
        {t('in-kubernetes:dashboards.details')}
      </Typography>
      <Tile>
        <DetailsList clusterInfos={clusterInfosWithHost} clusterId={clusterId} />
      </Tile>
    </Stack>
  );
}
