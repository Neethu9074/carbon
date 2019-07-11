import { fromJS } from 'immutable';
import React from 'react';

import createServerTableWithEmptyState from 'in-components/tables/ServerTable/ServerTableWithEmptyState';
import { percentageZeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import getKubernetesHostsByCluster from 'in-subscription/kubernetes/getKubernetesHostsByCluster';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { clusterId } from 'in-kubernetes/navigation/matrix';
import EntityLink from 'in-new-components/EntityLink';
import { getLabel } from 'in-sdk/snapshot';

const pathSegment = '/hosts';
const matrixPrefix = 'host.';

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    sortable: false,
    getContent(item, { timeConfig }) {
      const snapshot = fromJS(item);
      return (
        <EntityLink
          snapshot={snapshot}
          label={getLabel(snapshot)}
          href$={getDashboardLink(item.id, {
            pathname: '/physical/dashboard',
            to: timeConfig.to,
            focusedMoment: timeConfig.to
          })}
        />
      );
    }
  },
  {
    id: 'cpuUsage',
    label: 'CPU Usage',
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentageZeroDecimalPlaces}
          tooltipFormatter={percentageTwoDecimalPlaces}
          metric="cpu.used"
        />
      );
    }
  },
  {
    id: 'memUsage',
    label: 'Memory Usage',
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentageZeroDecimalPlaces}
          tooltipFormatter={percentageTwoDecimalPlaces}
          metric="memory.used"
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithEmptyState({
  ServerTable: createServerTableWithUrlState({
    paginationResettingUrlParameters: [...timeConfigUrlParameters, clusterId],
    columnDefinitions,
    defaultOrderBy: 'label',
    defaultOrderDirection: 'ASC',
    pathSegment,
    matrixPrefix
  }),
  columnDefinitions
});

export default function Infrastructure(props) {
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} clusterId={props.clusterId} />;
}

function getTableData({ page = 1, pageSize = 20, orderBy = 'label', orderDirection = 'ASC', timeConfig, clusterId }) {
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
      timeConfig
    }
  });
}
