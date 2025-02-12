/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect } from 'react';

import { KubernetesCluster, KubernetesClusterItemCounters } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Stack } from '@instana/components';

import {
  cronJobsDashboard,
  deploymentsDashboard,
  namespaceList,
  nodesDashboard,
  podsDashboard,
  servicesDashboard,
  useClusterDashboard
} from 'in-kubernetes/navigation/paths';
import InfoCardHeader from 'in-kubernetes/lists/components/InfoCardHeader/InfoCardHeader';
import { getKubernetesCounters } from 'in-kubernetes/lists/components/InfoCard/utils';
import InfoCardTile from 'in-kubernetes/lists/components/InfoCard/InfoCardTile';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './InfoCard.mless';

// Variable to track the max clusters that can be loaded.
// It's used to add the + to the label in case there are more than 200 clusters.
const maxTotalClusters = 200;

interface InfoCardProps extends KubernetesCluster, Omit<KubernetesClusterItemCounters, 'hosts'> {
  onDataFetched?: (clusterId: string, result: any) => void;
}

export interface KubernetesCountersProps {
  totalRunningPods: number;
  totalUnhealthyNodes: number;
  totalUnhealthyDeployments: number;
  hasNodesWithOnlyWarnings: boolean;
  hasDeploymentsWithOnlyWarnings: boolean;
}

export default function InfoCard({
  id: clusterId,
  workloads: { pods, deployments },
  nodes,
  namespaces,
  cronJobs,
  services,
  label,
  clusterDistribution,
  version,
  onDataFetched,
  ...props
}: Readonly<InfoCardProps>) {
  const timeConfig = useTimeConfig();
  const result =
    useObservable(() => getKubernetesCounters({ clusterId, timeConfig }), [clusterId, timeConfig]) ?? pendingResult;
  const isLoadingData = isLoading(result as any);

  // Send data to parent component via onDataFetched
  useEffect(() => {
    if (!isLoadingData) {
      onDataFetched?.(clusterId, result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusterId, isLoadingData, result]);

  const {
    totalRunningPods,
    totalUnhealthyNodes,
    totalUnhealthyDeployments,
    hasNodesWithOnlyWarnings,
    hasDeploymentsWithOnlyWarnings
  } = result as KubernetesCountersProps;

  const nodesHref = useClusterDashboard(clusterId, { tab: nodesDashboard });
  const deploymentsHref = useClusterDashboard(clusterId, { tab: deploymentsDashboard });
  const podsHref = useClusterDashboard(clusterId, { tab: podsDashboard });
  const namespacesHref = useClusterDashboard(clusterId, { tab: namespaceList });
  const cronJobsHref = useClusterDashboard(clusterId, { tab: cronJobsDashboard });
  const servicesHref = useClusterDashboard(clusterId, { tab: servicesDashboard });

  return (
    <div className={locals.infoCard}>
      <InfoCardHeader
        id={clusterId}
        label={label}
        clusterDistribution={clusterDistribution}
        version={version}
        {...props}
      />
      <Stack direction="horizontal">
        <InfoCardTile
          title={t('in-kubernetes:cloudNative.unhealthyNodes')}
          subtitle={t('in-kubernetes:cloudNative.totalNodes', { count: nodes })}
          href={nodesHref}
          isLoading={isLoadingData}
          hasIssues={totalUnhealthyNodes > 0}
          hasWarnings={hasNodesWithOnlyWarnings}
          tooltip={
            totalUnhealthyNodes >= maxTotalClusters
              ? t('in-kubernetes:cloudNative.manyUnhealthyWorkloads', { workload: 'nodes' })
              : undefined
          }
          counter={`${totalUnhealthyNodes}${totalUnhealthyNodes >= maxTotalClusters ? '+' : ''}`}
        />
        <InfoCardTile
          title={t('in-kubernetes:cloudNative.unhealthyDeployments')}
          subtitle={t('in-kubernetes:cloudNative.totalDeployments', { count: deployments })}
          href={deploymentsHref}
          isLoading={isLoadingData}
          hasIssues={totalUnhealthyDeployments > 0}
          hasWarnings={hasDeploymentsWithOnlyWarnings}
          tooltip={
            totalUnhealthyDeployments >= maxTotalClusters
              ? t('in-kubernetes:cloudNative.manyUnhealthyWorkloads', { workload: 'deployments' })
              : undefined
          }
          counter={`${totalUnhealthyDeployments}${totalUnhealthyDeployments >= maxTotalClusters ? '+' : ''}`}
        />
        <InfoCardTile
          title={t('in-kubernetes:cloudNative.runningPods')}
          isLoading={isLoadingData}
          href={`${podsHref};pod.phase=Running~`}
          subtitle={t('in-kubernetes:cloudNative.totalPods', { count: pods })}
          counter={`${totalRunningPods}`}
        />
        <InfoCardTile
          title={t('in-kubernetes:cloudNative.namespaces')}
          isLoading={isLoadingData}
          href={namespacesHref}
          counter={`${namespaces}`}
        />
        <InfoCardTile
          title={t('in-kubernetes:cloudNative.cronJobs')}
          isLoading={isLoadingData}
          href={cronJobsHref}
          counter={`${cronJobs}`}
        />
        <InfoCardTile
          title={t('in-kubernetes:cloudNative.services')}
          isLoading={isLoadingData}
          href={servicesHref}
          counter={`${services}`}
        />
      </Stack>
    </div>
  );
}
