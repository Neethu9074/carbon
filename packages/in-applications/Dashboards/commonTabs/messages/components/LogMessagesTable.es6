import React from 'react';

import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getLogMessages from 'in-subscription/application/getLogMessages';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import ServerTable from 'in-components/tables/ServerTable';
import { number } from 'in-services/formatters/number';
import Pill from 'in-new-components/Pill';
import Link from 'in-components/Link';

export default function LogMessagesTable({
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  applicationName,
  serviceName
}) {
  return (
    <ServerTable
      get={getTableData}
      defaultPageSize={10}
      columnDefinitions={getColumnDefinitions(applicationName, serviceName, endpointId)}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      timeConfig={timeConfig}
      paginationResettingProps={{ applicationId, serviceId, endpointId, timeConfig }}
      defaultOrderBy="logsAgg"
      defaultOrderDirection="DESC"
      size="compact"
      isSearchable={false}
    />
  );
}

function getTableData({ page, pageSize, orderBy, orderDirection, applicationId, serviceId, endpointId, timeConfig }) {
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

function getColumnDefinitions(applicationName, serviceName, endpointName) {
  return [
    {
      id: 'logMessage',
      label: 'Log Message',
      getContent(item) {
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
}

function Message({ message, applicationName, serviceName, endpointName }) {
  const logMessageFilter = { name: 'log.message', value: message };

  return (
    <Link href$={getLinkToAnalyze({ applicationName, serviceName, endpointName, filters: [logMessageFilter] })}>
      {message}
    </Link>
  );
}
