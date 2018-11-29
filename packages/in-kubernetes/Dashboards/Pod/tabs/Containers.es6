import { get } from 'lodash';
import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import { bytesTwoDecimalPlaces, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import getKubernetesContainers from 'in-subscription/kubernetes/getKubernetesContainers';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import EntityLink from 'in-new-components/EntityLink';
import MetricValue from 'in-components/MetricValue';

const pathSegment = '/summary';
const matrixPrefix = 'container.';

export default function Containers({ timeConfig, podId }) {
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
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['container', 'id'])}
          metric="cpu.total_usage"
          formatter={percentageZeroDecimalPlaces}
          timeWindowAggregation="mean"
        />
      );
    }
  },
  {
    id: 'memoryUsage',
    label: 'Memory Usage',
    sortable: false,
    getContent(item) {
      return (
        <MetricValue
          snapshotId={get(item, ['container', 'id'])}
          metric="memory.usage"
          formatter={bytesTwoDecimalPlaces}
          timeWindowAggregation="mean"
        />
      );
    }
  }
];
