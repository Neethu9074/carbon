/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
import getKubernetesPersistentVolumes from 'in-subscription/kubernetes/getKubernetesPersistentVolumes';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { clusterIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import { getInfraGranularity } from 'in-stores/metric/metric';
import Card from 'in-new-components/Card';
import { t } from 'in-i18n';

const pathSegment = '/nodes';
const matrixPrefix = 'node.';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-kubernetes:dashboards.name'),
    getContent(item) {
      return item.name;
    }
  },
  {
    id: 'phase',
    label: t('in-kubernetes:dashboards.phase'),
    getContent(item) {
      return item.phase;
    }
  },
  {
    id: 'reclaimPolicy',
    label: t('in-kubernetes:dashboards.reclaimPolicy'),
    getContent(item) {
      return item.persistentVolume.reclaimPolicy;
    }
  },
  {
    id: 'storageClassName',
    label: t('in-kubernetes:dashboards.storageClassName'),
    getContent(item) {
      return item.persistentVolume.storageClassName;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: 'persistentVolumes'
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
      <Card>
        <ServerTableWithUrlState get={getTableData} {...props} />
      </Card>
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
  nodeId,
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
      nodeId,
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
