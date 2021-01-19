/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
import getKubernetesPersistentVolumes from 'in-subscription/kubernetes/getKubernetesPersistentVolumes';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { clusterIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { MINIMUM_ROLLUP, getRollupForTimeframe } from 'in-stores/metric/metric';
import Card from 'in-new-components/Card';

const pathSegment = '/nodes';
const matrixPrefix = 'node.';

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item) {
      return item.name;
    }
  },
  {
    id: 'phase',
    label: 'Phase',
    getContent(item) {
      return item.phase;
    }
  },
  {
    id: 'reclaimPolicy',
    label: 'Reclaim Policy',
    getContent(item) {
      return item.persistentVolume.reclaimPolicy;
    }
  },
  {
    id: 'storageClassName',
    label: 'Storage Class Name',
    getContent(item) {
      return item.persistentVolume.storageClassName;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: 'PersistentVolumes'
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
  clusterId
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
      timeConfig
    },
    granularity: getRollupForTimeframe(timeConfig).rollup || MINIMUM_ROLLUP
  });
}
