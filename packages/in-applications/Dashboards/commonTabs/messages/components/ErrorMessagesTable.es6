import React from 'react';

import AnalyzeMessagesButton from 'in-applications/Dashboards/commonTabs/messages/components/AnalyzeMessagesButton';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getErrorMessages from 'in-subscription/application/getErrorMessages';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { operators } from 'in-analyze/applicationFilter';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

import locals from './MessagesTable.mless';

const pathSegment = '/errorMessages';
const matrixPrefix = 'error.';

export default function ErrorMessagesTable({
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  applicationName,
  serviceName
}) {
  return (
    <ServerTableWithUrlBoundState
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      defaultPageSize={10}
      columnDefinitions={columnDefinitions}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      applicationName={applicationName}
      serviceName={serviceName}
      endpointName={endpointId}
      timeConfig={timeConfig}
      paginationResettingProps={{ applicationId, serviceId, endpointId, timeConfig }}
      defaultOrderBy="callsAgg"
      defaultOrderDirection="DESC"
      size="compact"
      cardTitle="Error Messages"
      rightHeader={
        <AnalyzeMessagesButton
          groupByTagName="call.error.message"
          applicationName={applicationName}
          serviceName={serviceName}
          endpointId={endpointId}
          className={locals.analyzeButton}
        />
      }
    />
  );
}

function getTableData({
  query,
  page,
  pageSize,
  orderBy,
  orderDirection,
  applicationId,
  serviceId,
  endpointId,
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
      endpoint: endpointId
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

const columnDefinitions = [
  {
    id: 'errorMessage',
    label: 'Error Message',
    getContent(item, { applicationName, serviceName, endpointName }) {
      return (
        <Message
          message={item.message}
          applicationName={applicationName}
          serviceName={serviceName}
          endpointName={endpointName}
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

function Message({ message, applicationName, serviceName, endpointName }) {
  let displayedMessage;
  let errorMessageFilter;
  const erroneousFilter = { name: 'call.erroneous', value: 'true' };

  if (!message || message == '') {
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
        filters: [erroneousFilter, errorMessageFilter]
      })}
    >
      {displayedMessage}
    </Link>
  );
}
