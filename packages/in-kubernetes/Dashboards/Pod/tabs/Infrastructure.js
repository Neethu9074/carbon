import React, { Fragment } from 'react';
import { get } from 'lodash';

import {
  bytesTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import getKubernetesContainers from 'in-subscription/kubernetes/getKubernetesContainers';
import { Td, Table, Thead, Tbody, Tr, Th } from 'in-components/tables/sharedComponents';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import PodMessage from 'in-kubernetes/Dashboards/commonComponents/PodMessage';
import Capitalize from 'in-kubernetes/Dashboards/commonComponents/Capitalize';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getContainerIconByPlugin } from 'in-kubernetes/icons';
import { Row, Col } from 'in-new-components/layout/Grid';
import Tooltip from 'in-components/Tooltip';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

const pathSegment = '/summary';
const matrixPrefix = 'container.';

export default connectTo(
  ({ data: pod, timeConfig }) => ({
    monitoredContainersResult: getTableData({
      query: '',
      page: 1,
      pageSize: 20,
      orderBy: 'label',
      orderDirection: 'ASC',
      timeConfig,
      podId: pod.id
    })
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
  return (
    <ServerTableWithUrlBoundState
      cardTitle="Containers"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={getColumnDefinitions(pod)}
      timeConfig={timeConfig}
      podId={pod.id}
      paginationResettingProps={['podId', 'timeConfig']}
      defaultOrderBy="label"
      defaultOrderDirection="ASC"
    />
  );
}

function UnmonitoredContainers({ containerStatuses }) {
  const statesMap = {};
  for (let i = 0; i < containerStatuses.length; i++) {
    statesMap[containerStatuses[i].containerSnapshotId] = containerStatuses[i];
  }

  return (
    <Card title="Containers (Unmonitored)">
      <Table>
        <Thead>
          <Tr size="compact">
            <Th>Name</Th>
            <Th>Ready</Th>
            <Th>Status</Th>
            <Th>Message</Th>
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
              <Td>{status.ready ? 'Yes' : 'No'}</Td>
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
  const allContainerStatuses = [
    ...get(pod, ['status', 'initContainerStatuses'], []),
    ...get(pod, ['status', 'containerStatuses'], [])
  ];
  const statesMap = {};
  for (let i = 0; i < allContainerStatuses.length; i++) {
    statesMap[allContainerStatuses[i].containerSnapshotId] = allContainerStatuses[i];
  }

  return [
    {
      id: 'label',
      label: 'Name',
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
      label: 'Ready',
      sortable: false,
      getContent(item) {
        const id = get(item, ['container', 'id']);
        return statesMap[id] ? (statesMap[id].ready ? 'Yes' : 'No') : valueMissingPlaceholder;
      }
    },
    {
      id: 'status',
      label: 'Status',
      sortable: false,
      getContent(item) {
        const id = get(item, ['container', 'id']);
        return statesMap[id] ? <Capitalize>{statesMap[id].state.status}</Capitalize> : valueMissingPlaceholder;
      }
    },
    {
      id: 'message',
      label: 'Message',
      sortable: false,
      getContent(item) {
        const id = get(item, ['container', 'id']);
        return statesMap[id] ? <PodMessage message={statesMap[id].state.message} /> : valueMissingPlaceholder;
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
    },
    {
      id: 'health',
      label: 'Health',
      getContent(item, { timeConfig }) {
        return (
          <EntityHealthIndicator
            openIssues={item.entityHealthInfo.openIssues.length}
            maxSeverity={item.entityHealthInfo.maxSeverity}
            IndicatorPresenter={HealthIndicatorPresenter}
            timeConfig={timeConfig}
            snapshotId={item.container.id}
          />
        );
      }
    }
  ];
}
