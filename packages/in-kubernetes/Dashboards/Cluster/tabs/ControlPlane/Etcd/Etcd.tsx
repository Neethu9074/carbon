/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Spacer, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Stack } from '@instana/carbon';
import { t } from '@instana/i18n-react';
import { Result } from '@instana/types';

import { ChartProps, EtcdProps } from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Etcd/types';
import EtcdChartsV3 from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Etcd/EtcdChartsV3';
import EtcdChartsV2 from 'in-kubernetes/Dashboards/Cluster/tabs/ControlPlane/Etcd/EtcdChartsV2';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import getEtcdHosts from 'in-kubernetes/subscriptions/getEtcdHosts';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import SectionLine from 'in-settings/components/SectionLine';
import { pendingResult } from 'in-services/fixedObjects';
import KpiCard from 'in-components/KpiCard';

interface EtcdHostInfoProps {
  clusterVersion: string;
  controlPlaneHostCount: number;
  controlPlaneHostWithEtcdCount: number;
  etcdSnapshotIds: string[];
  serverVersion: string;
}

export default function Etcd({ clusterId, timeConfig }: EtcdProps) {
  const etcdHostInfo: Result<EtcdHostInfoProps> =
    useObservable(getEtcdHosts({ filter: { clusterId, timeConfig } }), Object.values({ clusterId, timeConfig })) ??
    pendingResult;

  const etcdHostData = etcdHostInfo?.data;
  const clusterVersion = etcdHostData?.clusterVersion;

  if (!clusterVersion) {
    return (
      <Stack gap={5}>
        <Typography variant="heading-02" noMargin>
          {t('in-kubernetes:dashboards.etcd')}
        </Typography>
        <NoDataAvailable height={160} />
      </Stack>
    );
  }

  const renderValue = (value: string) => <span>{value}</span>;
  const { controlPlaneHostCount, controlPlaneHostWithEtcdCount } = etcdHostData;
  const availability = `${controlPlaneHostWithEtcdCount} of ${controlPlaneHostCount}`;

  return (
    <>
      <SectionLine isFullWidth />
      <Typography variant="heading-02">{t('in-kubernetes:dashboards.etcd')}</Typography>
      <Spacer vertical="normal" />

      <KpiGridRow sizes={[true, true]}>
        <KpiCard title={t('in-kubernetes:dashboards.cluster')} value={clusterVersion} />
        <KpiCard title={t('in-kubernetes:dashboards.availability')} value={availability} renderValue={renderValue} />
      </KpiGridRow>
      <Spacer vertical="large" />
      <EtcdChart
        clusterVersion={parseClusterVersion(clusterVersion)}
        snapshotId={etcdHostData?.etcdSnapshotIds[0]}
        timeConfig={timeConfig}
      />
    </>
  );
}

function EtcdChart({ snapshotId, timeConfig, clusterVersion }: ChartProps) {
  if (clusterVersion && clusterVersion >= 3) {
    return <EtcdChartsV3 snapshotId={snapshotId} timeConfig={timeConfig} />;
  }
  return <EtcdChartsV2 snapshotId={snapshotId} timeConfig={timeConfig} />;
}

function parseClusterVersion(clusterVersion: String): number {
  return Number(clusterVersion.substring(0, clusterVersion.lastIndexOf('.')));
}
