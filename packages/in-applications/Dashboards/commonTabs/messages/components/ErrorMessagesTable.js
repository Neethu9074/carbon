import React from 'react';

import AnalyzeMessagesButton from 'in-applications/Dashboards/commonTabs/messages/components/AnalyzeMessagesButton';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getErrorMessages from 'in-applications/subscriptions/getErrorMessages';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
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
    id: 'erroneousCallsAgg',
    label: 'Erroneous Call Count',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          metrics={item.metrics.erroneousCalls}
          metric={item.metrics.erroneousCallsAgg}
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
  defaultOrderBy: 'erroneousCallsAgg',
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
          includeSynthetic
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
  orderBy = 'erroneousCallsAgg',
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
      erroneousCallsAgg: {
        metric: 'erroneousCalls',
        aggregation: 'SUM'
      },
      erroneousCalls: {
        metric: 'erroneousCalls',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      }
    }
  });
}

function Message({ message, applicationName, serviceName, endpointName, boundaryScope }) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  let displayedMessage;
  let errorMessageFilter;
  const erroneousFilter = { name: 'call.erroneous', value: 'true' };
  const includeInternalFilter = { name: 'include_internal', value: 'true', operator: 'EQUALS' };
  const includeSyntheticFilter = { name: 'include_synthetic', value: 'true', operator: 'EQUALS' };

  if (!message || message === '') {
    displayedMessage = 'Erroneous call without error message';
    errorMessageFilter = { name: 'call.error.message', operator: operators.IS_EMPTY };
  } else {
    displayedMessage = message;
    errorMessageFilter = { name: 'call.error.message', value: message };
  }

  return (
    <Link
      href$={
        tagCatalog &&
        getLinkToAnalyze({
          applicationName,
          serviceName,
          endpointName,
          dataSource: 'calls',
          groupByTag: {},
          filters: [erroneousFilter, errorMessageFilter, includeInternalFilter, includeSyntheticFilter],
          tagCatalog,
          boundaryScope
        })
      }
    >
      {displayedMessage}
    </Link>
  );
}
