import React from 'react';

import AnalyzeMessagesButton from 'in-applications/Dashboards/commonTabs/messages/components/AnalyzeMessagesButton';
import createServerTableWithEmptyState from 'in-components/tables/ServerTable/ServerTableWithEmptyState';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getLogMessages from 'in-subscription/application/getLogMessages';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { number } from 'in-services/formatters/number';
import Pill from 'in-new-components/Pill';
import Link from 'in-components/Link';

const pathSegment = '/logMessages';
const matrixPrefix = 'log.';

import locals from './MessagesTable.mless';

const columnDefinitions = [
  {
    id: 'logMessage',
    label: 'Log Message',
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
    id: 'logLevel',
    label: 'Log Level',
    getContent(item) {
      return <Pill kind="lighter">{item.level}</Pill>;
    }
  },
  {
    id: 'logsAgg',
    label: 'Count',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          metrics={item.metrics.logs}
          metric={item.metrics.logsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithEmptyState({
  ServerTable: createServerTableWithUrlState({
    paginationResettingUrlParameters: [
      ...timeConfigUrlParameters,
      applicationDashboardUrlParameters.applicationId,
      applicationDashboardUrlParameters.serviceId,
      applicationDashboardUrlParameters.endpointId
    ],
    columnDefinitions,
    defaultOrderBy: 'logsAgg',
    defaultOrderDirection: 'DESC',
    defaultPageSize: 10,
    pathSegment,
    matrixPrefix
  }),
  columnDefinitions
});

export default function LogMessagesTable({
  applicationId,
  serviceId,
  endpointId,
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
      timeConfig={timeConfig}
      rightHeader={
        <AnalyzeMessagesButton
          groupByTagName="log.message"
          applicationName={applicationName}
          serviceName={serviceName}
          endpointName={endpointName}
          className={locals.analyzeButton}
        />
      }
    />
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 10,
  orderBy = 'logsAgg',
  orderDirection = 'DESC',
  applicationId,
  serviceId,
  endpointName,
  timeConfig
}) {
  return getLogMessages({
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
      endpointName: endpointName // logs are still using endpoint names as ids
    },
    metrics: {
      logsAgg: {
        metric: 'logs',
        aggregation: 'SUM'
      },
      logs: {
        metric: 'logs',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      }
    }
  });
}

function Message({ message, applicationName, serviceName, endpointName }) {
  const logMessageFilter = { name: 'log.message', value: message };

  return (
    <Link
      href$={getLinkToAnalyze({
        applicationName,
        serviceName,
        endpointName,
        dataSource: 'calls',
        groupByTag: {},
        filters: [logMessageFilter]
      })}
    >
      {message}
    </Link>
  );
}
