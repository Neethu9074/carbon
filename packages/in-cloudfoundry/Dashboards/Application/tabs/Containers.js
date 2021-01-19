/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import getCloudfoundryContainers from 'in-cloudfoundry/subscriptions/getCloudfoundryContainers';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { applicationIdUrlParameter } from 'in-cloudfoundry/navigation/urlParameters';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { bytes, percentage } from 'in-services/formatters/number';

const pathSegment = '/summary';
const matrixPrefix = 'container.';

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item, { timeConfig }) {
      return (
        <SeverityAwareEntityLink
          icon="lib_cloudfoundry"
          label={item.container.label}
          href$={getDashboardLink(item.container.id, {
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
    id: 'cfInstanceIndex',
    label: 'Instance Index',
    sortable: true,
    getContent(item) {
      const cfInstanceIndex =
        item.container.cfInstanceIndex !== null ? item.container.cfInstanceIndex : valueMissingPlaceholder;
      return cfInstanceIndex;
    }
  },
  {
    id: 'cpuTotal',
    label: 'CPU Total',
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.container.id}
          timeConfig={timeConfig}
          formatter={percentage.compact}
          tooltipFormatter={percentage.detailed}
          metric="cpu.total"
        />
      );
    }
  },
  {
    id: 'memoryTotal',
    label: 'Memory Total',
    sortable: false,
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.container.id}
          timeConfig={timeConfig}
          formatter={bytes.compact}
          tooltipFormatter={bytes.detailed}
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
          inContentArea
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: 'containers'
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, applicationIdUrlParameter],
  defaultOrderBy: 'cfInstanceIndex',
  defaultOrderDirection: 'ASC',
  columnDefinitions,
  pathSegment,
  matrixPrefix
});

export default function Containers({ applicationId, timeConfig }) {
  return (
    <ServerTableWithUrlState
      get={getTableData}
      timeConfig={timeConfig}
      applicationId={applicationId}
      tableInCard
      cardTitle="Containers"
    />
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'cfInstanceIndex',
  orderDirection = 'ASC',
  timeConfig,
  applicationId
}) {
  return getCloudfoundryContainers({
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
      applicationId,
      timeConfig
    }
  });
}
