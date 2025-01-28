/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement } from 'react';

import { TimeConfig, Result, KubernetesClusterItemCounters } from '@instana/types';
import { KeyValue, Li } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';

// @ts-expect-error
import getKubernetesClusterItemCounters from 'in-kubernetes/subscriptions/getKubernetesClusterItemCounters';
import { KubernetesListItemWithCursor } from 'in-kubernetes/subscriptions/exploreKubernetes';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { getHistoricMetric } from 'in-stores/metric';
import useTimeConfig from 'in-hooks/useTimeConfig';
import WithIcon from 'in-components/WithIcon';
import { t } from 'in-i18n';

import locals from 'in-kubernetes/explore/KubernetesExplore.mless';

interface MetricsParams {
  snapshotId: string;
  metric: string;
  timeConfig: TimeConfig;
}

function GetMetrics({ snapshotId, metric, timeConfig }: MetricsParams): ReactElement {
  let metricObservable = useObservable(
    getHistoricMetric({
      snapshotId,
      metric,
      timeConfig
    })
      .map((v: number[]) => Math.round(v[1]))
      .distinct(),
    []
  );
  return <>{metricObservable}</>;
}

function GetK8sClusterItemCounters({ snapshotId, timeConfig, metric }: MetricsParams): ReactElement {
  const r: Result<KubernetesClusterItemCounters> | null | undefined = useObservable(
    getKubernetesClusterItemCounters({ clusterId: snapshotId, timeConfig }),
    [snapshotId, timeConfig]
  );

  if (!r?.data) {
    return <></>;
  }
  if (metric == 'appWorkloads') {
    return (
      <>
        {r?.data?.workloads.daemonSets +
          r?.data?.workloads.deployments +
          r?.data?.workloads.deploymentConfigs +
          r?.data?.workloads.statefulSets}
      </>
    );
  }
  return <>{r?.data?.[metric as keyof KubernetesClusterItemCounters]}</>;
}

export function ClusterRow({
  item: { snapshotId, clusterLabel, clusterDistribution, label }
}: KubernetesListItemWithCursor) {
  const timeConfig = useTimeConfig();
  let nodeCount = GetMetrics({ snapshotId, metric: 'nodes.count', timeConfig });
  let podCount = GetMetrics({ snapshotId, metric: 'pods.count', timeConfig });
  let nameSpaceCount = GetK8sClusterItemCounters({ snapshotId, metric: 'namespaces', timeConfig });
  let appWorkloadCount = GetK8sClusterItemCounters({ snapshotId, metric: 'appWorkloads', timeConfig });
  let batchWorkloadCount = GetK8sClusterItemCounters({ snapshotId, metric: 'cronJobs', timeConfig });
  let serviceCount = GetK8sClusterItemCounters({ snapshotId, metric: 'services', timeConfig });
  return (
    <Li roundShadow toggleContentOnRowClick>
      <div className={locals.list}>
        <div className={locals.label}>
          <WithIcon icon={`lib_${clusterDistribution}`}>
            <KeyValue
              label={t('in-kubernetes:dashboards.name')}
              value={
                <Link href={'#/kubernetes/cluster;clusterId=' + snapshotId + '/summary'}>{clusterLabel || label}</Link>
              }
              accentuated
            />
          </WithIcon>
        </div>
        <div>
          <KeyValue
            label={t('in-kubernetes:dashboards.namespaces')}
            value={nameSpaceCount || valueMissingPlaceholder}
            accentuated
          />
        </div>
        <div>
          <KeyValue
            label={t('in-kubernetes:dashboards.nodes')}
            value={nodeCount || valueMissingPlaceholder}
            accentuated
          />
        </div>
        <div>
          <KeyValue
            label={t('in-kubernetes:dashboards.pods')}
            value={podCount || valueMissingPlaceholder}
            accentuated
          />
        </div>
        <div>
          <KeyValue
            label={t('in-kubernetes:dashboards.appWorkloadCount')}
            value={appWorkloadCount || valueMissingPlaceholder}
            accentuated
          />
        </div>
        <div>
          <KeyValue
            label={t('in-kubernetes:dashboards.batchWorkloadCount')}
            value={batchWorkloadCount || valueMissingPlaceholder}
            accentuated
          />
        </div>
        <div>
          <KeyValue
            label={t('in-kubernetes:dashboards.serviceCount')}
            value={serviceCount || valueMissingPlaceholder}
            accentuated
          />
        </div>
      </div>
    </Li>
  );
}
