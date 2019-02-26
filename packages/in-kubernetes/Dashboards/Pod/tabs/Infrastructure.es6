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
import Capitalize from 'in-kubernetes/Dashboards/commonComponents/Capitalize';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import ReadyIcon from 'in-kubernetes/Dashboards/commonComponents/ReadyIcon';
import EntityLink from 'in-new-components/EntityLink';

const pathSegment = '/summary';
const matrixPrefix = 'container.';

export default function Infrastructure({ data: pod, timeConfig, podId }) {
  return (
    <ServerTableWithUrlBoundState
      cardTitle="Containers"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={getColumnDefinitions(pod)}
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

function getColumnDefinitions(pod) {
  const states = get(pod, ['status', 'containerStatuses'], []);
  const statesMap = {};
  for (let i = 0; i < states.length; i++) {
    statesMap[states[i].containerSnapshotId] = states[i];
  }

  return [
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
      id: 'ready',
      label: 'Ready',
      sortable: false,
      getContent(item) {
        const id = get(item, ['container', 'id']);
        return statesMap[id] ? <ReadyIcon isReady={statesMap[id].ready} /> : '-';
      }
    },
    {
      id: 'status',
      label: 'Status',
      sortable: false,
      getContent(item) {
        const id = get(item, ['container', 'id']);
        return statesMap[id] ? <Capitalize>{statesMap[id].state.status}</Capitalize> : '-';
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
}
