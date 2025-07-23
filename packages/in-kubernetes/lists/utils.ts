/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { KubernetesClusterListItem, KubernetesNamespaceListItem, OrderDirection } from '@instana/types';

import { DropdownItem } from 'in-kubernetes/lists/components/SortingConfigurator/SortingConfigurator';
import { workloadExtraRenderers } from 'in-kubernetes/lists/renderers/workloadExtraInfo';
import { BaseProps, IdsProps } from 'in-kubernetes/navigation/paths';
import { TrackingFunction } from 'in-kubernetes/tracker';
import { t } from 'in-i18n';

type Workload =
  | 'unhealthyDeployments'
  | 'unhealthyNodes'
  | 'runningPods'
  | 'services'
  | 'cronJobs'
  | 'namespaces'
  | 'otelNodes'
  | 'otelPods'
  | 'otelContainers';
type TotalWorkload = 'totalDeployments' | 'totalNodes' | 'totalPods';
export type UnhealthWorkloads =
  | 'unhealthyDeploymentsCritical'
  | 'unhealthyDeploymentsWarnings'
  | 'unhealthyNodesCritical'
  | 'unhealthyNodesWarnings';

export type WorkloadValues = Workload | TotalWorkload | UnhealthWorkloads;

export interface OpenTelemetryMetrics {
  nodeCount: number;
  podCount: number;
  containerCount: number;
}

export type Item = KubernetesClusterListItem | KubernetesNamespaceListItem;

type CounterExtractor = (item: Item) => number;

export const name = 'name';
export const unhealthyNodes = 'unhealthyNodes';
export const unhealthyDeployments = 'unhealthyDeployments';
export const runningPods = 'runningPods';
export const namespaces = 'namespaces';
export const services = 'services';
export const cronJobs = 'cronJobs';
export const otelNodes = 'otelNodes';
export const otelPods = 'otelPods';
export const otelContainers = 'otelContainers';

export interface FilterProps extends Pick<OrderProps, 'orderBy' | 'orderDirection'> {
  query: string;
}

export interface CardProps {
  cardId: Workload;
  cardTitle: string;
  path: string;
  displaySubtitle?: boolean;
}

export interface CardItemProps {
  counter: number;
  href: string;
  onClick: () => void;
  subtitle?: string;
  additionalInfo?: JSX.Element;
}

export interface Card extends Omit<CardProps, 'path'>, CardItemProps {
  getHref?: (
    id: string,
    { tab, tabMatrix, timeConfig, clusterId, namespaceId }: BaseProps & Pick<IdsProps, 'clusterId' | 'namespaceId'>
  ) => string;
}

interface OrderProps {
  orderBy: string;
  orderDirection: OrderDirection;
}

export function createUrlParameter(pathSegment: string, matrixPrefix: string, initialState: string) {
  return {
    path: pathSegment,
    name: matrixPrefix,
    as: matrixPrefix,
    initialState
  };
}

export function getSortingOptions(cardDefinitions: CardProps[], excludedIds: string[]) {
  const additionalOptions = [
    {
      label: t('in-kubernetes:cloudNative.sortingOptions.unhealthyNodesCritical'),
      value: 'unhealthyNodesCritical'
    },
    {
      label: t('in-kubernetes:cloudNative.sortingOptions.unhealthyNodesWarnings'),
      value: 'unhealthyNodesWarnings'
    },
    {
      label: t('in-kubernetes:cloudNative.sortingOptions.unhealthyDeploymentsCritical'),
      value: 'unhealthyDeploymentsCritical'
    },
    {
      label: t('in-kubernetes:cloudNative.sortingOptions.unhealthyDeploymentsWarnings'),
      value: 'unhealthyDeploymentsWarnings'
    }
  ];

  const cardOptions: DropdownItem[] = cardDefinitions.map(
    ({ cardTitle, cardId }: Pick<Card, 'cardTitle' | 'cardId'>) => ({
      label: cardTitle,
      value: cardId
    })
  );

  const cardValues = new Set(cardOptions.map(card => card.value));

  const filteredAdditionalOptions = additionalOptions.filter(
    option => Array.from(cardValues).some(value => option.value.includes(value)) && !excludedIds.includes(option.value)
  );

  return [
    {
      label: t('in-kubernetes:cloudNative.sortingOptions.name'),
      value: name
    },
    ...filteredAdditionalOptions,
    ...cardOptions
  ].filter(({ value }) => !excludedIds.includes(value));
}

export interface GenerateCardProps extends CardProps {
  cardId: Workload;
  cardTitle: string;
  onTracking: TrackingFunction;
  getHref: (
    id: string,
    { tab, tabMatrix, timeConfig, clusterId, namespaceId }: BaseProps & Pick<IdsProps, 'clusterId' | 'namespaceId'>
  ) => string;
  item: Item;
}

export function generateCard({
  getHref,
  cardId,
  cardTitle,
  displaySubtitle = true,
  path,
  onTracking,
  item
}: GenerateCardProps) {
  const isClusterType = 'cluster' in item;
  const entityId = isClusterType ? item?.cluster?.id : item?.namespace?.id;
  const href = getHref(entityId, { tab: path });
  const counter = getCounterByWorkload(cardId, item);
  const totalCounter = getCounterByWorkload(getTotalCounterLabel(cardId), item);
  const totalUnhealthy = getCounterByWorkload(cardId, item);
  const additionalInfoRenderer = workloadExtraRenderers[cardId];
  const additionalInfo = additionalInfoRenderer?.({ cardId, item });
  const subtitle = displaySubtitle
    ? getWorkloadSubtitle(cardId, totalCounter, totalUnhealthy, additionalInfo)
    : undefined;
  const trackingContext = isClusterType ? item?.cluster?.label : item?.namespace?.label;

  const onClick = () => onTracking({ context: trackingContext, cardTitle, href });

  return {
    cardId,
    cardTitle,
    href,
    counter,
    onClick,
    subtitle,
    additionalInfo
  };
}

/**
 * Extracts counter values from Kubernetes items for various workload metrics
 * Each function safely handles potential undefined values and type variations
 */
const counterExtractors: Record<WorkloadValues, CounterExtractor> = {
  // Pod-related counters
  runningPods: item => item.workloads.podCounters?.runningPods ?? 0,
  totalPods: item => item.workloads.podCounters?.totalPods ?? 0,

  // Deployment-related counters
  unhealthyDeployments: item => {
    const counters = item.workloads.deploymentCounters;
    return (counters?.warningDeployments ?? 0) + (counters?.criticalDeployments ?? 0);
  },
  unhealthyDeploymentsCritical: item => item.workloads.deploymentCounters?.criticalDeployments ?? 0,
  unhealthyDeploymentsWarnings: item => item.workloads.deploymentCounters?.warningDeployments ?? 0,
  totalDeployments: item => item.workloads.deploymentCounters?.totalDeployments ?? 0,

  // Resource counters
  namespaces: item => ('namespaces' in item ? item.namespaces : 0) ?? 0,
  services: item => item.services ?? 0,
  cronJobs: item => item.cronJobs ?? 0,

  // Node-related counters
  unhealthyNodes: item => {
    if (!('nodeCounters' in item) || !item.nodeCounters) return 0;
    return (item.nodeCounters.warningNodes ?? 0) + (item.nodeCounters.criticalNodes ?? 0);
  },
  unhealthyNodesCritical: item =>
    ('nodeCounters' in item && item.nodeCounters ? item.nodeCounters.criticalNodes : 0) ?? 0,
  unhealthyNodesWarnings: item =>
    ('nodeCounters' in item && item.nodeCounters ? item.nodeCounters.warningNodes : 0) ?? 0,
  totalNodes: item => ('nodeCounters' in item && item.nodeCounters ? item.nodeCounters.totalNodes : 0) ?? 0,
  otelNodes: item => ('nodeCounters' in item && item.nodeCounters ? item.nodeCounters.totalNodes : 0) ?? 0,
  otelPods: item => item.workloads.podCounters?.totalPods ?? 0,
  otelContainers: item => item.workloads.containers ?? 0
};

/**
 * Retrieves a counter value for a specific workload type from an item
 * @param workload The type of workload to get the counter for
 * @param item The Kubernetes item containing the counter data
 * @returns The counter value, or 0 if not available
 */
export function getCounterByWorkload(workload: WorkloadValues | null, item: GenerateCardProps['item']): number {
  if (!workload || !item) {
    return 0;
  }

  const extractor = counterExtractors[workload];
  if (!extractor) {
    return 0;
  }

  return extractor(item);
}

/**
 * Maps a workload type to its corresponding total counter type
 * @param workload The workload type to get the total counter for
 * @returns The corresponding total counter type, or null if no mapping exists
 */
function getTotalCounterLabel(workload: WorkloadValues): WorkloadValues | null {
  const totalCounterMap: Partial<Record<WorkloadValues, TotalWorkload>> = {
    runningPods: 'totalPods',
    unhealthyDeployments: 'totalDeployments',
    unhealthyNodes: 'totalNodes'
  };

  return totalCounterMap[workload] || null;
}

/**
 * Generates a subtitle for a workload card based on its metrics
 * @param id The workload identifier
 * @param total The total count of the workload
 * @param totalUnhealthy The count of unhealthy items in the workload
 * @param additionalInfo Additional information element to display
 * @returns A formatted subtitle string
 */
function getWorkloadSubtitle(id: string, total: number, totalUnhealthy: number, additionalInfo?: JSX.Element): string {
  // For running pods or when no additional info is available, just show the total
  if (id === 'runningPods' || !additionalInfo) {
    return t('in-kubernetes:cloudNative.totalWorkload', { total });
  }

  // For workloads with unhealthy items, show both total and unhealthy counts
  if (total > 0 && totalUnhealthy > 0) {
    return t('in-kubernetes:cloudNative.totalUnhealthyWorkload', { total, totalUnhealthy });
  }

  return '';
}

/**
 * Maps sorting option keys to their corresponding data paths in the item objects
 * Used for sorting operations in the UI
 */
export const mappedSortingOptions: { [key: string]: string } = {
  runningPods: 'workloads.podCounters.runningPods',
  unhealthyDeploymentsCritical: 'workloads.deploymentCounters.criticalDeployments',
  unhealthyDeploymentsWarnings: 'workloads.deploymentCounters.warningDeployments',
  unhealthyNodesCritical: 'nodeCounters.criticalNodes',
  unhealthyNodesWarnings: 'nodeCounters.warningNodes'
};

export const urlStateDefinition = (path: string) => ({
  bind: [
    createUrlParameter(path, 'query', ''),
    createUrlParameter(path, 'orderBy', 'unhealthyDeploymentsCritical'),
    createUrlParameter(path, 'orderDirection', 'DESC')
  ],
  resets: [
    {
      bind: [
        createUrlParameter(path, 'orderBy', 'unhealthyDeploymentsCritical'),
        createUrlParameter(path, 'orderDirection', 'DESC')
      ],
      reset: {}
    }
  ]
});
