/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect } from 'react';

import { useObservable } from '@instana/hooks';
import { Stack } from '@instana/components';

import {
  BaseProps,
  cronJobsDashboard,
  deploymentsDashboard,
  IdsProps,
  namespaceList,
  nodesDashboard,
  podsDashboard,
  servicesDashboard
} from 'in-kubernetes/navigation/paths';
import {
  runningPods,
  unhealthyDeployments,
  unhealthyNodes,
  namespaces as namespacesLabel,
  services as servicesLabel,
  cronJobs as cronJobsLabel
} from 'in-kubernetes/utils';
import InfoCardHeader from 'in-kubernetes/lists/components/InfoCardHeader/InfoCardHeader';
import { getKubernetesCounters } from 'in-kubernetes/lists/components/InfoCard/utils';
import InfoCardTile from 'in-kubernetes/lists/components/InfoCard/InfoCardTile';
import { useKubernetesTracker } from 'in-kubernetes/tracker';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './InfoCard.mless';

// Variable to track the max clusters or namespaces that can be loaded.
// It's used to add the + to the label in case there are more than 200 clusters.
const maxTotalItems = 200;

export type Workload = 'cluster' | 'namespace';

interface InfoCardProps {
  type: Workload;
  data: any;
  onDataFetched?: (id: string, result: any) => void;
  getHrefs: (id: string, { tab, tabMatrix, timeConfig, clusterId }: BaseProps & Pick<IdsProps, 'clusterId'>) => string;
  workloads: string[];
}

export interface KubernetesCountersProps {
  totalRunningPods: number;
  totalUnhealthyNodes: number;
  totalUnhealthyDeployments: number;
  totalCronJobs?: number;
  hasNodesWithOnlyWarnings: boolean;
  hasDeploymentsWithOnlyWarnings: boolean;
}

export default function InfoCard({ type, data, onDataFetched, getHrefs, workloads }: Readonly<InfoCardProps>) {
  const timeConfig = useTimeConfig();
  const { kubernetesCardClicked } = useKubernetesTracker();
  const namespaceId = data?.namespace?.id;
  const clusterId = data?.cluster?.id;
  const isClusterType = type === 'cluster';

  const result =
    useObservable(
      () => getKubernetesCounters({ namespaceId, clusterId, timeConfig, type }),
      [namespaceId, clusterId, timeConfig]
    ) ?? pendingResult;
  const isLoadingData = isLoading(result as any);

  // Send data to parent component via onDataFetched
  useEffect(() => {
    if (!isLoadingData) {
      const id = clusterId ?? namespaceId;
      if (id) {
        onDataFetched?.(id, result);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespaceId, clusterId, isLoadingData, result]);

  const {
    totalCronJobs,
    totalRunningPods,
    totalUnhealthyNodes,
    totalUnhealthyDeployments,
    hasNodesWithOnlyWarnings,
    hasDeploymentsWithOnlyWarnings
  } = result as KubernetesCountersProps;

  const {
    workloads: { pods, deployments },
    clusterName,
    label,
    nodes,
    namespaces,
    cronJobs,
    services,
    name,
    version
  } = data;

  const id = clusterId ?? namespaceId;
  const clusterDistribution = data?.cluster?.clusterDistribution ?? 'kubernetes';

  const resourceHref = getHrefs(id, {});
  const nodesHref = getHrefs(id, { tab: nodesDashboard });
  const deploymentsHref = getHrefs(id, { tab: deploymentsDashboard });
  const podsHref = getHrefs(id, { tab: `${podsDashboard};pod.phase=Running~` });
  const namespacesHref = getHrefs(id, { tab: namespaceList });
  const servicesHref = getHrefs(id, { tab: servicesDashboard });
  const cronJobsHref = getHrefs(id, { tab: cronJobsDashboard });

  const shouldDisplayUnhealthyNodes = workloads.includes(unhealthyNodes) && nodesHref;
  const shouldDisplayUnhealthyDeployments = workloads.includes(unhealthyDeployments) && deploymentsHref;
  const shouldDisplayRunningPods = workloads.includes(runningPods) && podsHref;
  const shouldDisplayNamespaces = workloads.includes(namespacesLabel) && namespacesHref;
  const shouldDisplayServices = workloads.includes(servicesLabel) && servicesHref;
  const shouldDisplayCronJobs = workloads.includes(cronJobsLabel) && cronJobsHref;

  const resourceName = isClusterType ? { cluster: name } : { namespace: label };

  return (
    <div className={locals.infoCard}>
      <InfoCardHeader
        id={id}
        label={name ?? label}
        clusterDistribution={clusterDistribution}
        clusterName={clusterName}
        icon={isClusterType ? `lib_${clusterDistribution}` : `lib_kubernetes_namespace`}
        href={resourceHref}
        version={version}
      />
      <Stack direction="horizontal">
        {shouldDisplayUnhealthyNodes && (
          <InfoCardTile
            title={t('in-kubernetes:cloudNative.unhealthyNodes')}
            subtitle={t('in-kubernetes:cloudNative.totalNodes', { count: nodes })}
            href={nodesHref}
            isLoading={isLoadingData}
            hasIssues={totalUnhealthyNodes > 0}
            onClick={() => {
              kubernetesCardClicked({
                ...resourceName,
                cardTitle: t('in-kubernetes:cloudNative.unhealthyNodes'),
                href: nodesHref
              });
            }}
            hasWarnings={hasNodesWithOnlyWarnings}
            tooltip={
              totalUnhealthyNodes >= maxTotalItems
                ? t('in-kubernetes:cloudNative.manyUnhealthyWorkloads', { workload: 'nodes' })
                : undefined
            }
            counter={`${totalUnhealthyNodes}${totalUnhealthyNodes >= maxTotalItems ? '+' : ''}`}
          />
        )}
        {shouldDisplayUnhealthyDeployments && (
          <InfoCardTile
            title={t('in-kubernetes:cloudNative.unhealthyDeployments')}
            subtitle={t('in-kubernetes:cloudNative.totalDeployments', { count: deployments })}
            href={deploymentsHref}
            isLoading={isLoadingData}
            hasIssues={totalUnhealthyDeployments > 0}
            hasWarnings={hasDeploymentsWithOnlyWarnings}
            onClick={() => {
              kubernetesCardClicked({
                ...resourceName,
                cardTitle: t('in-kubernetes:cloudNative.unhealthyDeployments'),
                href: deploymentsHref
              });
            }}
            tooltip={
              totalUnhealthyDeployments >= maxTotalItems
                ? t('in-kubernetes:cloudNative.manyUnhealthyWorkloads', { workload: 'deployments' })
                : undefined
            }
            counter={`${totalUnhealthyDeployments}${totalUnhealthyDeployments >= maxTotalItems ? '+' : ''}`}
          />
        )}
        {shouldDisplayRunningPods && (
          <InfoCardTile
            title={t('in-kubernetes:cloudNative.runningPods')}
            isLoading={isLoadingData}
            href={podsHref}
            onClick={() => {
              kubernetesCardClicked({
                ...resourceName,
                cardTitle: t('in-kubernetes:cloudNative.runningPods'),
                href: podsHref
              });
            }}
            subtitle={t('in-kubernetes:cloudNative.totalPods', { count: pods })}
            counter={`${totalRunningPods}`}
          />
        )}
        {shouldDisplayNamespaces && (
          <InfoCardTile
            title={t('in-kubernetes:cloudNative.namespaces')}
            isLoading={isLoadingData}
            href={namespacesHref}
            counter={`${namespaces}`}
            onClick={() => {
              kubernetesCardClicked({
                ...resourceName,
                cardTitle: t('in-kubernetes:cloudNative.namespaces'),
                href: namespacesHref
              });
            }}
          />
        )}
        {shouldDisplayServices && (
          <InfoCardTile
            title={t('in-kubernetes:cloudNative.services')}
            isLoading={isLoadingData}
            href={servicesHref}
            counter={`${services}`}
            onClick={() => {
              kubernetesCardClicked({
                ...resourceName,
                cardTitle: t('in-kubernetes:cloudNative.services'),
                href: servicesHref
              });
            }}
          />
        )}
        {shouldDisplayCronJobs && (
          <InfoCardTile
            title={t('in-kubernetes:cloudNative.cronJobs')}
            isLoading={isLoadingData}
            href={cronJobsHref}
            counter={`${cronJobs ?? totalCronJobs}`}
            onClick={() => {
              kubernetesCardClicked({
                ...resourceName,
                cardTitle: t('in-kubernetes:cloudNative.cronJobs'),
                href: cronJobsHref
              });
            }}
          />
        )}
      </Stack>
    </div>
  );
}
