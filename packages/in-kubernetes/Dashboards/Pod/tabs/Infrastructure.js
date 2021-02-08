/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { get } from 'lodash';
import { t } from 'in-i18n';

import {
  bytesTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import getKubernetesContainers from 'in-subscription/kubernetes/getKubernetesContainers';
import { Td, Table, Thead, Tbody, Tr, Th } from 'in-components/tables/sharedComponents';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import PodMessage from 'in-kubernetes/Dashboards/commonComponents/PodMessage';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { podIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import { getContainerIconByPlugin } from 'in-kubernetes/icons';
import { Row, Col } from 'in-new-components/layout/Grid';
import Capitalize from 'in-new-components/Capitalize';
import Tooltip from 'in-components/Tooltip';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

const pathSegment = '/containers';
const matrixPrefix = 'container.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-kubernetes:dashboards.name'),
    getContent(item, { timeConfig }) {
      return (
        <SeverityAwareEntityLink
          icon={getContainerIconByPlugin(get(item, ['container', 'plugin']))}
          label={get(item, ['container', 'label'])}
          href$={getDashboardLink(get(item, ['container', 'id']), {
            pathname: '/physical/dashboard',
            to: timeConfig.to,
            focusedMoment: timeConfig.to
          })}
          severity={item.entityHealthInfo.maxSeverity}
        />
      );
    }
  },
  {
    id: 'ready',
    label: t('in-kubernetes:dashboards.ready'),
    sortable: false,
    getContent(item, { statesMap }) {
      const id = get(item, ['container', 'id']);
      return statesMap[id]
        ? statesMap[id].ready
          ? t('in-kubernetes:dashboards.yes')
          : t('in-kubernetes:dashboards.no')
        : valueMissingPlaceholder;
    }
  },
  {
    id: 'status',
    label: t('in-kubernetes:dashboards.status'),
    sortable: false,
    getContent(item, { statesMap }) {
      const id = get(item, ['container', 'id']);
      return statesMap[id] ? <Capitalize>{statesMap[id].state.status}</Capitalize> : valueMissingPlaceholder;
    }
  },
  {
    id: 'message',
    label: t('in-kubernetes:dashboards.message'),
    sortable: false,
    getContent(item, { statesMap }) {
      const id = get(item, ['container', 'id']);
      return statesMap[id] ? <PodMessage message={statesMap[id].state.message} /> : valueMissingPlaceholder;
    }
  },
  {
    id: 'cpuTotal',
    label: t('in-kubernetes:dashboards.cpuTotal'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={get(item, ['container', 'id'])}
          timeConfig={timeConfig}
          formatter={percentageZeroDecimalPlaces}
          tooltipFormatter={percentageTwoDecimalPlaces}
          metric="cpu.total_usage"
          renderPostChartContent={K8DashboardsMarkerLanes}
        />
      );
    }
  },
  {
    id: 'memoryUsage',
    label: t('in-kubernetes:dashboards.memoryUsage'),
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={get(item, ['container', 'id'])}
          timeConfig={timeConfig}
          formatter={bytesZeroDecimalPlaces}
          tooltipFormatter={bytesTwoDecimalPlaces}
          metric="memory.usage"
          renderPostChartContent={K8DashboardsMarkerLanes}
        />
      );
    }
  },
  {
    id: 'health',
    label: t('in-kubernetes:dashboards.health'),
    getContent(item, { timeConfig }) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.container.id}
          inContentArea
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, podIdUrlParameter],
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  columnDefinitions,
  pathSegment,
  matrixPrefix
});

export default connectTo(
  ({ data: pod, timeConfig }) => ({
    monitoredContainersResult: getTableData({ timeConfig, podId: pod.id })
  }),
  function UnmonitoredInfrastructure(props) {
    const { data: pod, monitoredContainersResult } = props;
    const isLoading = get(monitoredContainersResult, ['progress', 'loading']);
    const hasErrors = get(monitoredContainersResult, ['errors', 'length'], 0);

    if (isLoading || hasErrors) {
      return <MonitoredContainers {...props} />;
    }

    const monitoredSnapshotIds = monitoredContainersResult.data.items.map(item => item.container.id);
    const containerStatuses = [
      ...get(pod, ['status', 'initContainerStatuses'], []),
      ...get(pod, ['status', 'containerStatuses'], [])
    ].filter(containerStatus => monitoredSnapshotIds.indexOf(containerStatus.containerSnapshotId) === -1);

    if (monitoredSnapshotIds.length === 0) {
      return <UnmonitoredContainers containerStatuses={containerStatuses} />;
    } else if (containerStatuses.length === 0) {
      return <MonitoredContainers {...props} />;
    }
    return (
      <Fragment>
        <Row>
          <Col lg={12}>
            <MonitoredContainers {...props} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <UnmonitoredContainers containerStatuses={containerStatuses} />
          </Col>
        </Row>
      </Fragment>
    );
  }
);

function MonitoredContainers({ data: pod, timeConfig }) {
  const allContainerStatuses = [
    ...get(pod, ['status', 'initContainerStatuses'], []),
    ...get(pod, ['status', 'containerStatuses'], [])
  ];
  const statesMap = {};
  for (let i = 0; i < allContainerStatuses.length; i++) {
    statesMap[allContainerStatuses[i].containerSnapshotId] = allContainerStatuses[i];
  }

  return (
    <Card>
      <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} podId={pod.id} statesMap={statesMap} />
    </Card>
  );
}

function UnmonitoredContainers({ containerStatuses }) {
  const statesMap = {};
  for (let i = 0; i < containerStatuses.length; i++) {
    statesMap[containerStatuses[i].containerSnapshotId] = containerStatuses[i];
  }

  return (
    <Card title={t('in-kubernetes:dashboards.containersUnmonitored')}>
      <Table>
        <Thead>
          <Tr size="compact">
            <Th>{t('in-kubernetes:dashboards.name')}</Th>
            <Th>{t('in-kubernetes:dashboards.ready')}</Th>
            <Th>{t('in-kubernetes:dashboards.status')}</Th>
            <Th>{t('in-kubernetes:dashboards.message')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {containerStatuses.map((status, i) => (
            <Tr key={i}>
              <Td>
                <Tooltip content="The host of the container doesn't have an Instana Agent installed. See our documentation for more Information">
                  <span>{status.name}</span>
                </Tooltip>
              </Td>
              <Td>{status.ready ? t('in-kubernetes:dashboards.yes') : t('in-kubernetes:dashboards.no')}</Td>
              <Td>
                <Capitalize>{status.state.status}</Capitalize>
              </Td>
              <Td>
                <PodMessage message={status.message} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig,
  podId
}) {
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
