/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { FC } from 'react';

import { Cursor, EntityHealthInfo, IngestionOffsetCursor, TimeConfig } from '@instana/types';

export interface KubernetesListItemWithCursor {
  item: KubernetesClusterListItem;
  cursor?: IngestionOffsetCursor;
}
export interface KubernetesClusterListItem {
  clusterLabel: string;
  snapshotId: string;
  label: string;
  clusterDistribution?: string;
  namespaces?: number;
  nodes?: number;
  services?: number;
  pods?: number;
  deployments?: number;
  deploymentConfigs?: number;
  batchWorkloads?: number;
  appWorkloads?: number;
  entityHealthInfo?: EntityHealthInfo;
  metrics?: FC[];
}

export interface KubernetesQueryFilter {
  clusterId?: string;
  timeConfig: TimeConfig;
}

export interface Pagination {
  cursor?: Cursor;
  retrievalSize: number;
}

export interface Order {
  by: string;
  direction: string;
}

export interface KubernetesExploreQuery {
  query: ExploreClusterQuery;
}

export interface ExploreClusterResponse {
  items: ClusterItem[];
}

export interface ClusterItem {
  item: Cluster;
  cursor: String;
}

export interface Cluster {
  label: String;
  snapshotId: String;
  clusterDistribution: String;
}

export interface ExploreClusterQuery {
  pagination: Pagination;
  timeConfig: TimeConfig;
  search: String;
  facets?: Facets;
}

interface Facets {
  podUID?: string;
  workloadUID?: string;
}

export interface KubernetesClusterExploreQuery {
  filter: KubernetesQueryFilter;
  orderBy: Order;
  pagination: Pagination;
}
