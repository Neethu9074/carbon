import React from 'react';

import AnalyzeMessagesButton from 'in-applications/Dashboards/commonTabs/messages/components/AnalyzeMessagesButton';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getErrorMessages from 'in-applications/subscriptions/getErrorMessages';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { operators } from 'in-analyze/applicationFilter';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

import locals from './MessagesTable.mless';

const pathSegment = '/errorMessages';
const matrixPrefix = 'error.';

const columnDefinitions = [
  {
    id: 'errorMessage',
    label: 'Error Message',
    getContent(item, { applicationName, serviceName, endpointName, boundaryScope }) {
      return (
        <Message
          message={item.message}
          applicationName={applicationName}
          serviceName={serviceName}
          endpointName={endpointName}
          boundaryScope={boundaryScope}
        />
      );
    },
    noWrap: true,
    ellipsis: '50vw'
  },
  {
    id: 'callsAgg',
    label: 'Count',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          metrics={item.metrics.calls}
          metric={item.metrics.callsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: 'error messages'
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    applicationDashboardUrlParameters.applicationId,
    applicationDashboardUrlParameters.serviceId,
    applicationDashboardUrlParameters.endpointId
  ],
  columnDefinitions,
  defaultOrderBy: 'callsAgg',
  defaultOrderDirection: 'DESC',
  defaultPageSize: 10,
  pathSegment,
  matrixPrefix
});

export default function ErrorMessagesTable({
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  timeConfig,
  applicationName,
  serviceName,
  endpointName
}) {
  return (
    <ServerTableWithUrlState
      size="compact"
      get={getTableData}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      applicationName={applicationName}
      serviceName={serviceName}
      endpointName={endpointName}
      boundaryScope={boundaryScope}
      timeConfig={timeConfig}
      rightHeader={({ query }) => (
        <AnalyzeMessagesButton
          groupByTagName="call.error.message"
          applicationName={applicationName}
          serviceName={serviceName}
          endpointName={endpointName}
          className={locals.analyzeButton}
          boundaryScope={boundaryScope}
          query={query}
          includeInternal
          showErroneous
        />
      )}
    />
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 10,
  orderBy = 'callsAgg',
  orderDirection = 'DESC',
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  timeConfig
}) {
  return getErrorMessages({
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
      timeConfig,
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      applicationBoundaryScope: boundaryScope
    },
    metrics: {
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      },
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      }
    }
  });
}

function Message({ message, applicationName, serviceName, endpointName, boundaryScope }) {
  let displayedMessage;
  let errorMessageFilter;
  const erroneousFilter = { name: 'call.erroneous', value: 'true' };
  const includeInternal = { name: 'include_internal', value: 'true', operator: 'EQUALS' };

  if (!message || message === '') {
    displayedMessage = 'Erroneous call without error message';
    errorMessageFilter = { name: 'call.error.message', operator: operators.IS_EMPTY };
  } else {
    displayedMessage = message;
    errorMessageFilter = { name: 'call.error.message', value: message };
  }

  return (
    <Link
      href$={getLinkToAnalyze({
        applicationName,
        serviceName,
        endpointName,
        dataSource: 'calls',
        groupByTag: {},
        filters: [erroneousFilter, errorMessageFilter, includeInternal],
        boundaryScope
      })}
    >
      {displayedMessage}
    </Link>
  );
}
