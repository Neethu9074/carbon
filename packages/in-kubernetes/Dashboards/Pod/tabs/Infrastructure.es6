import { get } from 'lodash';
import React from 'react';

import {
  bytesTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import getKubernetesContainers from 'in-subscription/kubernetes/getKubernetesContainers';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import EntityLink from 'in-new-components/EntityLink';

const pathSegment = '/summary';
const matrixPrefix = 'container.';

export default function Infrastructure({ timeConfig, podId }) {
  return (
    <ServerTableWithUrlBoundState
      cardTitle="Containers"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      podId={podId}
      paginationResettingProps={['podId', 'timeConfig']}
      defaultOrderBy="label"
      defaultOrderDirection="ASC"
    />
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig, podId }) {
  return getKubernetesContainers({
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
      podId,
      timeConfig
    }
  });
}

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item, { timeConfig }) {
      return (
        <EntityLink
          icon="lib_container"
          label={get(item, ['container', 'label'])}
          href$={getDashboardLink(get(item, ['container', 'id']), {
            pathname: '/physical/dashboard',
            to: timeConfig.to,
            focusedMoment: timeConfig.to
          })}
        />
      );
    }
  },
  {
    id: 'cpuTotal',
    label: 'CPU Total %',
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={get(item, ['container', 'id'])}
          timeConfig={timeConfig}
          formatter={percentageZeroDecimalPlaces}
          tooltipFormatter={percentageTwoDecimalPlaces}
          metric="cpu.total_usage"
        />
      );
    }
  },
  {
    id: 'memoryUsage',
    label: 'Memory Usage',
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={get(item, ['container', 'id'])}
          timeConfig={timeConfig}
          formatter={bytesZeroDecimalPlaces}
          tooltipFormatter={bytesTwoDecimalPlaces}
          metric="memory.usage"
        />
      );
    }
  }
];
