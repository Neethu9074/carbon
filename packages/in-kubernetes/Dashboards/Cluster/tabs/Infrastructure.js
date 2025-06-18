/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';
import React from 'react';

import { percentageZeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import getKubernetesHostsByCluster from 'in-kubernetes/subscriptions/getKubernetesHostsByCluster';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { clusterIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import EntityLink from 'in-components/EntityLink';
import { getLabel } from 'in-sdk/snapshot';
import { t } from 'in-i18n';

const pathSegment = '/hosts';
const matrixPrefix = 'host.';

const DashboardLink = ({ item, timeConfig }) => {
  const snapshot = fromJS(item);
  const href = useGetDashboardLink()(item.id, {
    pathname: '/physical/dashboard',
    to: timeConfig.to,
    focusedMoment: timeConfig.to
  });

  return <EntityLink snapshot={snapshot} label={getLabel(snapshot)} href={href} />;
};

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-kubernetes:dashboards.name'),
    sortable: false,
    getContent: (item, { timeConfig }) => <DashboardLink item={item} timeConfig={timeConfig} />
  },
  {
    id: 'cpuUsage',
    label: t('in-kubernetes:dashboards.cpuUsage'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentageZeroDecimalPlaces}
          tooltipFormatter={percentageTwoDecimalPlaces}
          metric="cpu.used"
          renderPostChartContent={K8DashboardsMarkerLanes}
        />
      );
    }
  },
  {
    id: 'memUsage',
    label: t('in-kubernetes:dashboards.memoryUsage'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentageZeroDecimalPlaces}
          tooltipFormatter={percentageTwoDecimalPlaces}
          metric="memory.used"
          renderPostChartContent={K8DashboardsMarkerLanes}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, clusterIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function Infrastructure(props) {
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} clusterId={props.clusterId} />;
}

function getTableData({
  page = 1,
  pageSize = 20,
  query,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig,
  clusterId
}) {
  return getKubernetesHostsByCluster({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      clusterId,
      timeConfig,
      label: query
    }
  });
}
