/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import AnalyzeMessagesButton from 'in-applications/Dashboards/commonTabs/messages/components/AnalyzeMessagesButton';
import getErrorMessages, { getAllErrorMessagesThenFilter } from 'in-applications/subscriptions/getErrorMessages';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { EQUALS, IS_EMPTY } from 'in-components/QueryBuilder/tagFilter/operators';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { number } from 'in-services/formatters/number';
import { collationLanguage, t } from 'in-i18n';

import locals from './MessagesTable.mless';

const pathSegment = '/errorMessages';
const matrixPrefix = 'error.';

const columnDefinitions = [
  {
    id: 'errorMessage',
    label: t('in-applications:labelErrorMessage'),
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
    label: t('in-applications:labelErroneousCallCount'),
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
    title: t('in-applications:dashboards.noDataAvailable.errorMessagesTitle'),
    description: t('in-applications:dashboards.noDataAvailable.errorMessagesDescription')
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
      cardTitle={t('in-applications:viewLists.errorMessages')}
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
  const errorWithoutMessageText = t('in-applications:dashboards.errorCallWithoutMessage');
  const trimmedQuery = query.trim().toLowerCase();

  // Check if we're searching for error messages without text
  if (trimmedQuery && errorWithoutMessageText.trim().toLowerCase().includes(trimmedQuery)) {
    return getAllErrorMessagesThenFilter({
      query,
      page,
      pageSize: 100, // increased pageSize = higher possibility to get all items + get correct table behavior
      orderBy,
      orderDirection,
      applicationId,
      serviceId,
      endpointId,
      boundaryScope,
      timeConfig
    });
  }

  return getErrorMessages({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection,
      collation: collationLanguage
    },
    filter: {
      label: query,
      timeConfig,
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      applicationBoundaryScope: boundaryScope,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
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
    },
    supportedOrderByCriteria: false
  });
}

function Message({ message, applicationName, serviceName, endpointName, boundaryScope }) {
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  let displayedMessage;
  let errorMessageFilter;
  const erroneousFilter = tagFilter('call.erroneous', EQUALS, true);

  if (!message || message === '') {
    displayedMessage = t('in-applications:dashboards.errorCallWithoutMessage');
    errorMessageFilter = tagFilter('call.error.message', IS_EMPTY);
  } else {
    displayedMessage = message;
    errorMessageFilter = tagFilter('call.error.message', EQUALS, message);
  }

  return (
    <Link
      href={getLinkToApplicationAnalyze({
        applicationName,
        serviceName,
        endpointName,
        dataSource: 'calls',
        formModel: joinExpressions({ expressions: [erroneousFilter, errorMessageFilter] }),
        hiddenCalls: { includeInternal: true, includeSynthetic: true },
        boundaryScope
      })}
    >
      {displayedMessage}
    </Link>
  );
}
