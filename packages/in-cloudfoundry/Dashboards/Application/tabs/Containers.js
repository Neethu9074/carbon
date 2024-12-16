/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import getCloudfoundryContainers from 'in-cloudfoundry/subscriptions/getCloudfoundryContainers';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { applicationIdUrlParameter } from 'in-cloudfoundry/navigation/urlParameters';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { bytes, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const pathSegment = '/summary';
const matrixPrefix = 'container.';

const DashboardLink = ({ item, timeConfig }) => {
  const href = useGetDashboardLink()(item.container.id, {
    pathname: '/physical/dashboard',
    to: timeConfig.to,
    focusedMoment: timeConfig.to
  });

  return (
    <SeverityAwareEntityLink
      icon="lib_cloudfoundry"
      label={item.container.label}
      href={href}
      severity={item.entityHealthInfo.maxSeverity}
    />
  );
};

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-cloudfoundry:dashboards.name'),
    getContent: (item, { timeConfig }) => <DashboardLink item={item} timeConfig={timeConfig} />
  },
  {
    id: 'cfInstanceIndex',
    label: t('in-cloudfoundry:dashboards.instanceIndex'),
    sortable: true,
    getContent(item) {
      const cfInstanceIndex =
        item.container.cfInstanceIndex !== null ? item.container.cfInstanceIndex : valueMissingPlaceholder;
      return cfInstanceIndex;
    }
  },
  {
    id: 'cpuTotal',
    label: t('in-cloudfoundry:dashboards.cpuTotal'),
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
    label: t('in-cloudfoundry:dashboards.memoryTotal'),
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
    label: t('in-cloudfoundry:dashboards.health'),
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
    title: t('in-cloudfoundry:dashboards.noDataAvailable.containersTitle'),
    description: t('in-cloudfoundry:dashboards.noDataAvailable.containersDescription')
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
      cardTitle={t('in-cloudfoundry:dashboards.containers')}
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
