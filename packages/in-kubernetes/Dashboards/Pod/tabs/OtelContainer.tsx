/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';
import { get } from 'lodash';

import { Card, DataTable as CarbonDataTable } from '@instana/components';

import {
  bytesTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
// @ts-expect-error TS migration
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
// @ts-expect-error TS migration
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error TS migration
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
// @ts-expect-error TS migration
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import getOtelKubernetesContainers from 'in-kubernetes/subscriptions/getOtelKubernetesContainers';
import K8DashboardsMarkerLanes from 'in-kubernetes/Dashboards/K8DashboardsMarkerLanes';
// @ts-expect-error TS migration
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
// @ts-expect-error TS migration
import PodMessage from 'in-kubernetes/Dashboards/commonComponents/PodMessage';
import { podIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import { getContainerIconByPlugin } from 'in-kubernetes/utils';
import { Row, Col } from 'in-components/layout/Grid';
import Capitalize from 'in-components/Capitalize';
import Tooltip from 'in-components/Tooltip';
// @ts-expect-error TS migration
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';
import { TimeConfig, EntityHealthInfo } from 'in-types';
import { isLoading, hasError } from 'in-services/util/result';
import { Error as InstanaError } from '@instana/types/typeDefinitions';

const pathSegment = '/containers';
const matrixPrefix = 'container.';

interface DashboardLinkProps {
  item: ContainerItem;
  timeConfig: TimeConfig;
}

const DashboardLink = ({ item, timeConfig }: DashboardLinkProps) => {
  const href = useGetDashboardLink()(get(item, ['container', 'id']), {
    pathname: '/physical/dashboard',
    to: timeConfig.to ?? undefined,
    focusedMoment: timeConfig.to ?? undefined
  });

  return (
    <SeverityAwareEntityLink
      icon={getContainerIconByPlugin(get(item, ['container', 'plugin'], ''))}
      label={get(item, ['container', 'label'])}
      href={href}
      severity={item.entityHealthInfo.maxSeverity}
    />
  );
};

interface StatesMap {
  [containerSnapshotId: string]: {
    ready?: boolean;
    state: {
      status: string;
      message?: string;
    };
  };
}

interface ColumnContext {
  timeConfig: TimeConfig;
  statesMap: StatesMap;
}

interface ContainerItem {
  container: {
    id: string;
    label: string;
    plugin?: string;
  };
  entityHealthInfo: EntityHealthInfo;
}

interface ColumnDefinition {
  id: string;
  label: string;
  sortable?: boolean;
  getContent: (item: ContainerItem, context: ColumnContext) => React.ReactNode;
};

const columnDefinitions: ColumnDefinition[] = [
  {
    id: 'label',
    label: t('in-kubernetes:dashboards.name'),
    getContent: (item, { timeConfig }) => <DashboardLink item={item} timeConfig={timeConfig} />
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

interface PodData {
  id: string;
  status?: {
    initContainerStatuses?: ContainerStatus[];
    containerStatuses?: ContainerStatus[];
  };
}

interface ContainerStatus {
  containerSnapshotId: string;
  name?: string;
  ready?: boolean;
  state: {
    status: string;
    message?: string;
  };
  message?: string;
}

interface MonitoredContainersResultItem {
  container: {
    id: string;
    label: string;
    plugin?: string;
  };
  entityHealthInfo: EntityHealthInfo;
}

interface MonitoredContainersResult {
  data: {
    items: MonitoredContainersResultItem[];
  };
  progress?: {
    loading?: boolean;
  };
  errors: InstanaError[];
}

interface UnmonitoredInfrastructureProps {
  data: PodData;
  timeConfig: TimeConfig;
  monitoredContainersResult: MonitoredContainersResult;
}

export default connectTo(
  ({ data: pod, timeConfig }: { data: PodData; timeConfig: TimeConfig }) => ({
    monitoredContainersResult: getTableData({ timeConfig, podId: pod.id })
  }),
  function UnmonitoredInfrastructure(props: UnmonitoredInfrastructureProps) {
    const { data: pod, monitoredContainersResult } = props;
    if (isLoading() || hasError()) {
      return <MonitoredContainers {...props} />;
    }

    const monitoredSnapshotIds = monitoredContainersResult.data.items.map(item => item.container.id);
    const containerStatuses: ContainerStatus[] = [
      ...get(pod, ['status', 'initContainerStatuses'], []),
      ...get(pod, ['status', 'containerStatuses'], [])
    ].filter(
      (containerStatus: ContainerStatus) =>
        monitoredSnapshotIds.indexOf(containerStatus.containerSnapshotId) === -1
    );

    if (monitoredSnapshotIds.length === 0) {
      return <UnmonitoredContainers containerStatuses={containerStatuses} />;
    } else if (containerStatuses.length === 0) {
      return <MonitoredContainers {...props} />;
    }
    return (
      <>
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
      </>
    );
  }
);

function MonitoredContainers({ data: pod, timeConfig }: { data: PodData; timeConfig: TimeConfig }) {
  const allContainerStatuses = [
    ...get(pod, ['status', 'initContainerStatuses'], []),
    ...get(pod, ['status', 'containerStatuses'], [])
  ];
  const statesMap: { [key: string]: ContainerStatus } = {};
  for (let i = 0; i < allContainerStatuses.length; i++) {
    statesMap[allContainerStatuses[i].containerSnapshotId] = allContainerStatuses[i];
  }

  return (
    <Card>
      <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} podId={pod.id} statesMap={statesMap} />
    </Card>
  );
}

function UnmonitoredContainers({ containerStatuses }: { containerStatuses: ContainerStatus[] }) {
  const statesMap: { [key: string]: ContainerStatus } = {};
  for (let i = 0; i < containerStatuses.length; i++) {
    statesMap[containerStatuses[i].containerSnapshotId] = containerStatuses[i];
  }
  const carbonHeaders = [
    {
      key: 'name',
      header: t('in-kubernetes:dashboards.name')
    },
    {
      key: 'ready',
      header: t('in-kubernetes:dashboards.ready')
    },
    {
      key: 'status',
      header: t('in-kubernetes:dashboards.status')
    },
    {
      key: 'message',
      header: t('in-kubernetes:dashboards.message')
    }
  ];

  const carbonRows = containerStatuses.map(({ name, ready, state, message }) => ({
    id: name,
    ['name']: (
      <Tooltip content={t('in-kubernetes:dashboards.nameTooltip')}>
        <span>{name}</span>
      </Tooltip>
    ),
    ['ready']: ready ? t('in-kubernetes:dashboards.yes') : t('in-kubernetes:dashboards.no'),
    ['status']: <Capitalize>{state.status}</Capitalize>,
    ['message']: <PodMessage message={message} />
  }));

  return (
    <Card title={t('in-kubernetes:dashboards.containersUnmonitored')} disableLayer>
      <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
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
}: {
  query?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: string;
  timeConfig: TimeConfig;
  podId: string;
}) {
  return getOtelKubernetesContainers({
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
