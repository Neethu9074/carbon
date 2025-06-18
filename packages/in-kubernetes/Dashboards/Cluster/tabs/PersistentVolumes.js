/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
import ServerSideSortedMetricValue from 'in-components/tables/sharedComponents/ServerSideSortedMetricValue';
import getKubernetesPersistentVolumes from 'in-kubernetes/subscriptions/getKubernetesPersistentVolumes';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { bytesTwoDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { clusterIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import { usePersistentVolumeDashboard } from 'in-kubernetes/navigation/paths';
import { getInfraGranularity } from 'in-stores/metric/metric';
import { t } from 'in-i18n';

const pathSegment = '/nodes';
const matrixPrefix = 'node.';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-kubernetes:dashboards.name'),
    getContent(item) {
      const { persistentVolume, name, entityHealthInfo } = item;
      return <PersistentVolumeLink id={persistentVolume.id} name={name} entityHealthInfo={entityHealthInfo} />;
    }
  },
  {
    id: 'storageClassName',
    label: t('in-kubernetes:dashboards.storageClassName'),
    getContent({ persistentVolume }) {
      const { storageClassName } = persistentVolume;
      return storageClassName || valueMissingPlaceholder;
    }
  },
  {
    id: 'capacity.storage',
    label: t('in-kubernetes:dashboards.storageTotalCapacity'),
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.persistentVolume.id}
          metric={columnId}
          sortedMetricValue={props.orderBy === columnId && item.sortedMetricValue}
          formatter={bytesTwoDecimalPlaces}
          minRollup={10000}
        />
      );
    }
  },
  {
    id: 'currentMetrics.capacity.used',
    label: t('in-kubernetes:dashboards.storageUsedCapacity'),
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.persistentVolume.id}
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
    getContent(item, props, columnId) {
      return (
        <ServerSideSortedMetricValue
          snapshotId={item.persistentVolume.id}
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
    getContent(item) {
      return item.phase;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-kubernetes:dashboards.noDataAvailable.persistentVolumesTitle'),
    description: t('in-kubernetes:dashboards.noDataAvailable.persistentVolumesDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, clusterIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function PersistentVolumes(props) {
  return (
    <>
      <K8sAgentMonitoringIssueNotifications {...props} entityName="persistentvolumes" />
      <ServerTableWithUrlState get={getTableData} {...props} />
    </>
  );
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
  workloadControllerId,
  nodeId
}) {
  return getKubernetesPersistentVolumes({
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
      workloadControllerId,
      nodeId
    },
    granularity: getInfraGranularity(timeConfig)
  });
}

function PersistentVolumeLink({ id, name, entityHealthInfo }) {
  const href = usePersistentVolumeDashboard(id);

  return (
    <SeverityAwareEntityLink
      icon="lib_infra_kubernetesPersistentVolume"
      label={name}
      href={href}
      severity={entityHealthInfo.maxSeverity}
    />
  );
}
