import { fromJS } from 'immutable';
import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import { percentageZeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import getKubernetesHostsByCluster from 'in-subscription/kubernetes/getKubernetesHostsByCluster';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import EntityLink from 'in-new-components/EntityLink';
import { getLabel } from 'in-sdk/snapshot';

const pathSegment = '/summary';
const matrixPrefix = 'host.';

export default function Infrastructure({ timeConfig, clusterId }) {
  return (
    <ServerTableWithUrlBoundState
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      clusterId={clusterId}
      paginationResettingProps={['clusterId', 'timeConfig']}
    />
  );
}

function getTableData({ page, pageSize, orderBy, orderDirection, timeConfig, clusterId }) {
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
