import React from 'react';

import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getErrorMessages from 'in-subscription/application/getErrorMessages';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import ServerTable from 'in-components/tables/ServerTable';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

import locals from './ErrorMessagesTable.mless';

export default function ErrorMessagesTable({
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
      defaultOrderBy="callsAgg"
      defaultOrderDirection="DESC"
      size="compact"
      isSearchable={false}
      noDataMessage="You have no errors"
    />
  );
}

function getTableData({ page, pageSize, orderBy, orderDirection, applicationId, serviceId, endpointId, timeConfig }) {
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

function getColumnDefinitions(applicationName, serviceName, endpointName) {
  return [
    {
      id: 'errorMessage',
      label: 'Error Message',
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
}

function Message({ message, applicationName, serviceName, endpointName }) {
  if (!message || message == '') {
    return <div className={locals.noLink}>Empty message</div>;
  } else {
    const errorMessageFilter = { name: 'call.error.message', value: message };

    return (
      <Link
        href$={getLinkToAnalyze({
          applicationName,
          serviceName,
          endpointName,
          dataSource: 'calls',
          filters: [errorMessageFilter]
        })}
      >
        {message}
      </Link>
    );
  }
}
