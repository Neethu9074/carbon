import React from 'react';

import AnalyzeMessagesButton from 'in-applications/Dashboards/commonTabs/messages/components/AnalyzeMessagesButton';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getLogMessages from 'in-subscription/application/getLogMessages';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { number } from 'in-services/formatters/number';
import Pill from 'in-new-components/Pill';
import Link from 'in-components/Link';

const pathSegment = '/logMessages';
const matrixPrefix = 'log.';

import locals from './MessagesTable.mless';

export default function LogMessagesTable({
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
      timeConfig={timeConfig}
      paginationResettingProps={{ applicationId, serviceId, endpointId, timeConfig }}
      defaultOrderBy="logsAgg"
      defaultOrderDirection="DESC"
      size="compact"
      cardTitle="Log Messages"
      rightHeader={
        <AnalyzeMessagesButton
          groupByTagName="log.message"
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
      endpoint: endpointId
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

function Message({ message, applicationName, serviceName, endpointName }) {
  const logMessageFilter = { name: 'log.message', value: message };

  return (
    <Link
      href$={getLinkToAnalyze({
        applicationName,
        serviceName,
        endpointName,
        dataSource: 'calls',
        filters: [logMessageFilter]
      })}
    >
      {message}
    </Link>
  );
}
