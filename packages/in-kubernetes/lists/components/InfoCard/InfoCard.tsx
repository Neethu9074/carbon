/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { KubernetesCluster, KubernetesClusterItemCounters } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { Stack } from '@instana/components';

import InfoCardHeader from 'in-kubernetes/lists/components/InfoCardHeader/InfoCardHeader';
import { getKubernetesCounters } from 'in-kubernetes/lists/components/InfoCard/utils';
import { clusterDashboardFullyQualified } from 'in-kubernetes/navigation/paths';
import InfoCardTile from 'in-kubernetes/lists/components/InfoCard/InfoCardTile';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './InfoCard.mless';

// Variable to track the max clusters that can be loaded.
// It's used to add the + to the label in case there are more than 200 clusters.
const maxTotalClusters = 200;

type InfoCardProps = KubernetesCluster & Omit<KubernetesClusterItemCounters, 'hosts'>;

interface KubernetesCountersProps {
  totalRunningPods: number;
  totalNodesIssues: number;
  hasNodesWithOnlyWarnings: boolean;
  hasDeploymentsWithOnlyWarnings: boolean;
  totalDeploymentsIssues: number;
}

const defaultValues: KubernetesCountersProps = {
  totalRunningPods: 0,
  totalNodesIssues: 0,
  hasNodesWithOnlyWarnings: false,
  hasDeploymentsWithOnlyWarnings: false,
  totalDeploymentsIssues: 0
};

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
  ...props
}: InfoCardProps) {
  const timeConfig = useTimeConfig();
  const {
    totalRunningPods,
    totalNodesIssues,
    hasNodesWithOnlyWarnings,
    hasDeploymentsWithOnlyWarnings,
    totalDeploymentsIssues
  }: KubernetesCountersProps =
    useObservable(() => getKubernetesCounters({ clusterId, timeConfig }), [clusterId, timeConfig]) ?? defaultValues;

  const getWorkloadHref = generateHrefForWorkload(clusterId);

  return (
    <div className={locals.cluster}>
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
          href={getWorkloadHref('nodes')}
          hasIssues={totalNodesIssues > 0}
          hasWarnings={hasNodesWithOnlyWarnings}
          tooltip={
            totalNodesIssues >= maxTotalClusters
              ? t('in-kubernetes:cloudNative.manyUnhealthyWorkloads', { workload: 'nodes' })
              : undefined
          }
          counter={`${totalNodesIssues}${totalNodesIssues >= maxTotalClusters ? `+` : ''}`}
        />
        <InfoCardTile
          title={t('in-kubernetes:cloudNative.unhealthyDeployments')}
          subtitle={t('in-kubernetes:cloudNative.totalDeployments', { count: deployments })}
          href={getWorkloadHref('deployments')}
          hasIssues={totalDeploymentsIssues > 0}
          hasWarnings={hasDeploymentsWithOnlyWarnings}
          tooltip={
            totalDeploymentsIssues >= maxTotalClusters
              ? t('in-kubernetes:cloudNative.manyUnhealthyWorkloads', { workload: 'deployments' })
              : undefined
          }
          counter={`${totalDeploymentsIssues}${totalDeploymentsIssues >= maxTotalClusters ? `+` : ''}`}
        />
        <InfoCardTile
          title={t('in-kubernetes:cloudNative.runningPods')}
          href={getWorkloadHref('pods;pod.phase=Running~;pod.page=1')}
          subtitle={t('in-kubernetes:cloudNative.totalPods', { count: pods })}
          counter={`${totalRunningPods}`}
        />
        <InfoCardTile
          title={t('in-kubernetes:cloudNative.namespaces')}
          href={getWorkloadHref('namespaces')}
          counter={`${namespaces}`}
        />
        <InfoCardTile
          title={t('in-kubernetes:cloudNative.cronJobs')}
          href={getWorkloadHref('cronjobs')}
          counter={`${cronJobs}`}
        />
        <InfoCardTile
          title={t('in-kubernetes:cloudNative.services')}
          href={getWorkloadHref('services')}
          counter={`${services}`}
        />
      </Stack>
    </div>
  );
}

function generateHrefForWorkload(clusterId: string) {
  return (workload: string) => `#${clusterDashboardFullyQualified};clusterId=${clusterId}/${workload}`;
}
