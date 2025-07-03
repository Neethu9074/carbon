/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  KubernetesPersistentVolumeClaimListItem,
  TimeConfig,
  OrderDirection,
  KubernetesQueryFilter
} from '@instana/types';

//@ts-expect-error TS migration
import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
//@ts-expect-error TS migration
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
//@ts-expect-error TS migration
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
//@ts-expect-error TS migration
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import getKubernetesPersistentVolumeClaims from 'in-kubernetes/subscriptions/getKubernetesPersistentVolumeClaims';
import { bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { usePersistentVolumeClaimDashboard } from 'in-kubernetes/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { clusterIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import { getInfraGranularity } from 'in-stores/metric/metric';
import { t } from 'in-i18n';

const defaultPathSegment = '/persistentvolumeclaims';
const matrixPrefix = 'persistentvolumeclaim.';

interface QueryParams {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  timeConfig: TimeConfig;
  clusterId?: string;
  namespaceId?: string;
  podId?: string;
  persistentVolumeId?: string;
  workloadControllerId?: string;
  nodeId?: string;
}

interface PersistentVolumeClaimsTableProps extends KubernetesQueryFilter {
  pathSegment?: string;
}

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-kubernetes:dashboards.name'),
    getContent(item: KubernetesPersistentVolumeClaimListItem) {
      return <PersistentVolumeClaimLink {...item} />;
    }
  },
  {
    id: 'currentMetrics.capacity.used',
    label: t('in-kubernetes:dashboards.storageUsedCapacity'),
    getContent(item: KubernetesPersistentVolumeClaimListItem, props: QueryParams, columnId: string) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.persistentVolumeClaim.id}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={bytesTwoDecimalPlaces}
          minRollup={10000}
        />
      );
    }
  },
  {
    id: 'limits.storage',
    label: t('in-kubernetes:dashboards.storageLimit'),
    getContent(item: KubernetesPersistentVolumeClaimListItem, props: QueryParams, columnId: string) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.persistentVolumeClaim.id}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={bytesTwoDecimalPlaces}
          minRollup={10000}
        />
      );
    }
  },
  {
    id: 'requests.storage',
    label: t('in-kubernetes:dashboards.storageRequested'),
    getContent(item: KubernetesPersistentVolumeClaimListItem, props: QueryParams, columnId: string) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.persistentVolumeClaim.id}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={bytesTwoDecimalPlaces}
          minRollup={10000}
        />
      );
    }
  },
  {
    id: 'status.capacity',
    label: t('in-kubernetes:dashboards.storageTotalCapacity'),
    getContent(item: KubernetesPersistentVolumeClaimListItem, props: QueryParams, columnId: string) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.persistentVolumeClaim.id}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={bytesTwoDecimalPlaces}
          minRollup={10000}
        />
      );
    }
  },
  {
    id: 'currentMetrics.capacity.usedPercent',
    label: t('in-kubernetes:dashboards.storageUtilization'),
    getContent(item: KubernetesPersistentVolumeClaimListItem, props: QueryParams, columnId: string) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.persistentVolumeClaim.id}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={percentageTwoDecimalPlaces}
          minRollup={10000}
        />
      );
    }
  },
  {
    id: 'phase',
    label: t('in-kubernetes:dashboards.phase'),
    getContent(item: KubernetesPersistentVolumeClaimListItem) {
      return item.phase;
    }
  }
];

export default function PersistentVolumeClaimsTable(props: PersistentVolumeClaimsTableProps) {
  const { pathSegment } = props;

  const ServerTableWithUrlState = createServerTableWithUrlState({
    Renderer: withEmptyTableState({
      columnDefinitions,
      title: t('in-kubernetes:dashboards.noDataAvailable.persistentVolumeClaimsTitle'),
      description: t('in-kubernetes:dashboards.noDataAvailable.persistentVolumeClaimsDescription')
    }),
    paginationResettingUrlParameters: [...timeConfigUrlParameters, clusterIdUrlParameter],
    columnDefinitions,
    defaultOrderBy: 'name',
    defaultOrderDirection: 'ASC',
    pathSegment: pathSegment ?? defaultPathSegment,
    matrixPrefix
  });

  return <ServerTableWithUrlState get={getTableData} {...props} />;
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'name',
  orderDirection = 'ASC',
  timeConfig,
  clusterId,
  namespaceId,
  podId,
  persistentVolumeId,
  workloadControllerId,
  nodeId
}: QueryParams) {
  return getKubernetesPersistentVolumeClaims({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      clusterId,
      timeConfig,
      namespaceId,
      podId,
      persistentVolumeId,
      workloadControllerId,
      nodeId
    },
    granularity: getInfraGranularity(timeConfig)
  });
}

function PersistentVolumeClaimLink({
  persistentVolumeClaim,
  name,
  entityHealthInfo
}: Readonly<KubernetesPersistentVolumeClaimListItem>) {
  const href = usePersistentVolumeClaimDashboard(persistentVolumeClaim.id);

  return (
    <SeverityAwareEntityLink
      icon="lib_infra_kubernetesPersistentVolumeClaim"
      label={name}
      href={href}
      severity={entityHealthInfo.maxSeverity}
    />
  );
}
