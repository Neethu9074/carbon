/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TimeConfig } from '@instana/types';

import {
  serviceId as matrixServiceId,
  clusterId as matrixClusterId,
  namespaceId as matrixNamespaceId,
  podId as matrixPodId,
  nodeId as matrixNodeId,
  cronJobId as matrixCronJobId,
  deploymentId as matrixDeploymentId,
  deploymentConfigId as matrixDeploymentConfigId,
  daemonSetId as matrixDaemonSetId,
  statefulSetId as matrixStatefulSetId
} from 'in-kubernetes/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { LocationMutator } from 'in-stores/navigation/navigation';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';

interface NavigateToDashboardProps {
  id: string;
  base: string;
  tab?: string;
  tabMatrix?: Record<string, string>;
  timeConfig?: TimeConfig;
  matrixSegment: string;
  matrixParam: string;
  paramsCallback?: LocationMutator;
}

export const kubernetes = '/kubernetes';

export const serviceDashboard = `/service`;
export const servicesDashboard = `/services`;
export const serviceDashboardFullyQualified = `${kubernetes}${serviceDashboard}`;
export const serviceDashboardDetailsFullyQualified = `${serviceDashboardFullyQualified}/details`;

export const clusterList = '/clusters';
export const clusterDashboard = `/cluster`;
export const clusterListFullyQualified = `${kubernetes}${clusterList}`;
export const clusterDashboardFullyQualified = `${kubernetes}${clusterDashboard}`;
export const clusterDashboardDetailsFullyQualified = `${clusterDashboardFullyQualified}/details`;

export const namespaceList = '/namespaces';
export const namespaceDashboard = `/namespace`;
export const namespaceListFullyQualified = `${kubernetes}${namespaceList}`;
export const namespaceDashboardFullyQualified = `${kubernetes}${namespaceDashboard}`;
export const namespaceDashboardDetailsFullyQualified = `${namespaceDashboardFullyQualified}/details`;

export const explore = '/explore';
export const exploreFullyQualified = `${kubernetes}${explore}`;

export const podDashboard = `/pod`;
export const podsDashboard = `/pods`;
export const podDashboardFullyQualified = `${kubernetes}${podDashboard}`;
export const podDashboardDetailsFullyQualified = `${podDashboardFullyQualified}/details`;

export const nodeDashboard = `/node`;
export const nodesDashboard = '/nodes';
export const nodeDashboardFullyQualified = `${kubernetes}${nodeDashboard}`;
export const nodeDashboardDetailsFullyQualified = `${nodeDashboardFullyQualified}/details`;

export const cronJobDashboard = `/cronjob`;
export const cronJobsDashboard = `/cronjobs`;
export const cronJobDashboardFullyQualified = `${kubernetes}${cronJobDashboard}`;
export const cronJobDashboardDetailsFullyQualified = `${cronJobDashboardFullyQualified}/details`;

export const deploymentDashboard = `/deployment`;
export const deploymentsDashboard = `/deployments`;
export const deploymentDashboardFullyQualified = `${kubernetes}${deploymentDashboard}`;
export const deploymentDashboardDetailsFullyQualified = `${deploymentDashboardFullyQualified}/details`;

export const deploymentConfigDashboard = `/deploymentconfig`;
export const deploymentConfigDashboardFullyQualified = `${kubernetes}${deploymentConfigDashboard}`;
export const deploymentConfigDashboardDetailsFullyQualified = `${deploymentConfigDashboardFullyQualified}/details`;

export const daemonSetDashboard = `/daemonset`;
export const daemonSetsDashboard = `/daemonsets`;
export const daemonSetDashboardFullyQualified = `${kubernetes}${daemonSetDashboard}`;
export const daemonSetDashboardDetailsFullyQualified = `${daemonSetDashboardFullyQualified}/details`;

export const statefulSetDashboard = `/statefulset`;
export const statefulSetsDashboard = `/statefulsets`;
export const statefulSetDashboardFullyQualified = `${kubernetes}${statefulSetDashboard}`;
export const statefulSetDashboardDetailsFullyQualified = `${statefulSetDashboardFullyQualified}/details`;

export const summaryTab = '/summary';

interface BaseProps {
  tab?: NavigateToDashboardProps['tab'];
  tabMatrix?: NavigateToDashboardProps['tabMatrix'];
  timeConfig?: NavigateToDashboardProps['timeConfig'];
}

interface IdsProps {
  deploymentId?: string;
  nodeId?: string;
  cronJobId?: string;
  podId?: string;
  clusterId?: string;
  namespaceId?: string;
}

export function useServiceDashboard(
  serviceId: string,
  {
    tab,
    tabMatrix,
    timeConfig,
    namespaceId,
    clusterId
  }: BaseProps & Pick<IdsProps, 'namespaceId' | 'clusterId'> = emptyObject
) {
  return useNavigateToDashboard({
    base: serviceDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: serviceDashboard,
    matrixParam: matrixServiceId,
    id: serviceId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, serviceDashboard, matrixNamespaceId, namespaceId);
      setOrDeleteMatrixKey(params, serviceDashboard, matrixClusterId, clusterId);
    }
  });
}

export function useClusterDashboard(clusterId: string, { tab, tabMatrix, timeConfig }: BaseProps = emptyObject) {
  return useNavigateToDashboard({
    base: clusterDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: clusterDashboard,
    matrixParam: matrixClusterId,
    id: clusterId
  });
}

export function useNamespaceDashboard(
  namespaceId: string,
  { tab, tabMatrix, timeConfig, clusterId }: BaseProps & Pick<IdsProps, 'clusterId'> = emptyObject
) {
  return useNavigateToDashboard({
    base: namespaceDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: namespaceDashboard,
    matrixParam: matrixNamespaceId,
    id: namespaceId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, namespaceDashboard, matrixClusterId, clusterId);
    }
  });
}

export function usePodDashboard(
  podId: string,
  {
    tab,
    tabMatrix,
    timeConfig,
    clusterId,
    namespaceId,
    deploymentId,
    nodeId,
    cronJobId
  }: BaseProps & IdsProps = emptyObject
) {
  return useNavigateToDashboard({
    base: podDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: podDashboard,
    matrixParam: matrixPodId,
    id: podId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, podDashboard, matrixClusterId, clusterId);
      setOrDeleteMatrixKey(params, podDashboard, matrixNamespaceId, namespaceId);
      setOrDeleteMatrixKey(params, podDashboard, matrixDeploymentId, deploymentId);
      setOrDeleteMatrixKey(params, podDashboard, matrixCronJobId, cronJobId);
      setOrDeleteMatrixKey(params, podDashboard, matrixNodeId, nodeId);
    }
  });
}

export function useNodeDashboard(
  nodeId: string,
  { tab, tabMatrix, timeConfig, clusterId }: BaseProps & Pick<IdsProps, 'clusterId'> = emptyObject
) {
  return useNavigateToDashboard({
    base: nodeDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: nodeDashboard,
    matrixParam: matrixNodeId,
    id: nodeId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, nodeDashboard, matrixClusterId, clusterId);
    }
  });
}

export function useCronJobDashboard(
  cronJobId: string,
  { tab, tabMatrix, timeConfig, clusterId, podId }: BaseProps & Pick<IdsProps, 'clusterId' | 'podId'> = emptyObject
) {
  return useNavigateToDashboard({
    base: cronJobDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: cronJobDashboard,
    matrixParam: matrixCronJobId,
    id: cronJobId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, cronJobDashboard, matrixClusterId, clusterId);
      setOrDeleteMatrixKey(params, cronJobDashboard, matrixPodId, podId);
    }
  });
}

export function useDeploymentDashboard(
  deploymentId: string,
  {
    tab,
    tabMatrix,
    timeConfig,
    clusterId,
    namespaceId
  }: BaseProps & Pick<IdsProps, 'namespaceId' | 'clusterId'> = emptyObject
) {
  return useNavigateToDashboard({
    base: deploymentDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: deploymentDashboard,
    matrixParam: matrixDeploymentId,
    id: deploymentId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, deploymentDashboard, matrixClusterId, clusterId);
      setOrDeleteMatrixKey(params, deploymentDashboard, matrixNamespaceId, namespaceId);
    }
  });
}

export function useDeploymentConfigDashboard(
  deploymentConfigId: string,
  {
    tab,
    tabMatrix,
    timeConfig,
    clusterId,
    namespaceId
  }: BaseProps & Pick<IdsProps, 'namespaceId' | 'clusterId'> = emptyObject
) {
  return useNavigateToDashboard({
    base: deploymentConfigDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: deploymentConfigDashboard,
    matrixParam: matrixDeploymentConfigId,
    id: deploymentConfigId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, deploymentConfigDashboard, matrixClusterId, clusterId);
      setOrDeleteMatrixKey(params, deploymentConfigDashboard, matrixNamespaceId, namespaceId);
    }
  });
}

export function useDaemonSetDashboard(
  daemonSetId: string,
  {
    tab,
    tabMatrix,
    timeConfig,
    clusterId,
    namespaceId
  }: BaseProps & Pick<IdsProps, 'clusterId' | 'namespaceId'> = emptyObject
) {
  return useNavigateToDashboard({
    base: daemonSetDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: daemonSetDashboard,
    matrixParam: matrixDaemonSetId,
    id: daemonSetId,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, daemonSetDashboard, matrixClusterId, clusterId);
      setOrDeleteMatrixKey(params, daemonSetDashboard, matrixNamespaceId, namespaceId);
    }
  });
}

export function useStatefulSetDashboard(
  id: string,
  {
    tab,
    tabMatrix,
    timeConfig,
    clusterId,
    namespaceId
  }: BaseProps & Pick<IdsProps, 'clusterId' | 'namespaceId'> = emptyObject
) {
  return useNavigateToDashboard({
    base: statefulSetDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: statefulSetDashboard,
    matrixParam: matrixStatefulSetId,
    id,
    paramsCallback: params => {
      setOrDeleteMatrixKey(params, statefulSetDashboard, matrixClusterId, clusterId);
      setOrDeleteMatrixKey(params, statefulSetDashboard, matrixNamespaceId, namespaceId);
    }
  });
}

export function useDashboardForEntity(snapshotId: string, plugin: string) {
  const podDashboard = usePodDashboard(snapshotId);
  const serviceDashboard = useServiceDashboard(snapshotId);
  const clusterDashboard = useClusterDashboard(snapshotId);
  const namespaceDashboard = useNamespaceDashboard(snapshotId);
  const nodeDashboard = useNodeDashboard(snapshotId);
  const deploymentDashboard = useDeploymentDashboard(snapshotId);
  const deploymentConfigDashboard = useDeploymentConfigDashboard(snapshotId);
  const daemonSetDashboard = useDaemonSetDashboard(snapshotId);
  const statefulSetDashboard = useStatefulSetDashboard(snapshotId);

  switch (plugin) {
    case plugins.kubernetesPod:
      return podDashboard;
    case plugins.kubernetesNode:
      return nodeDashboard;
    case plugins.kubernetesService:
      return serviceDashboard;
    case plugins.kubernetesDeployment:
      return deploymentDashboard;
    case plugins.openshiftDeploymentConfig:
      return deploymentConfigDashboard;
    case plugins.kubernetesDaemonSet:
      return daemonSetDashboard;
    case plugins.kubernetesNamespace:
      return namespaceDashboard;
    case plugins.kubernetesCluster:
      return clusterDashboard;
    case plugins.kubernetesStatefulSet:
      return statefulSetDashboard;
    default:
      return null;
  }
}

function useNavigateToDashboard({
  base,
  tab = summaryTab,
  tabMatrix = {},
  timeConfig,
  matrixSegment,
  matrixParam,
  id,
  paramsCallback
}: NavigateToDashboardProps) {
  const { location, createHref } = useNavigation();
  location.pathname = `${base}${tab}`;

  setOrDeleteMatrixKey(location, matrixSegment, matrixParam, id);

  if (timeConfig != null) {
    setTimeConfig(location, timeConfig);
  }

  location.matrix[tab] = tabMatrix;

  if (paramsCallback) {
    paramsCallback(location);
  }

  return createHref(location);
}

export const useNavigateToClusterDashboard = () => {
  const { createHref, location } = useNavigation();

  return (clusterId: string, { tab = summaryTab, tabMatrix = {}, timeConfig }: BaseProps = emptyObject) => {
    location.pathname = clusterDashboardFullyQualified + tab;

    setOrDeleteMatrixKey(location, clusterDashboard, matrixClusterId, clusterId);

    if (timeConfig != null) {
      setTimeConfig(location, timeConfig);
    }

    location.matrix[tab] = tabMatrix;

    return createHref(location);
  };
};
