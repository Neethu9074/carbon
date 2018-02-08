import React, { Fragment } from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { serviceDashboard, getEndpointDashboard } from 'in-applications/navigation/paths';
import { getSparkChartGranularity, getResolvedTimeframe } from 'in-applications/metrics';
import { applicationId, serviceId } from 'in-applications/navigation/matrix';
import { number, ms, percentage } from 'in-services/formatters/number';
import translation from 'in-applications/typesTranslation/service';
import getEndpoints from 'in-subscription/application/getEndpoints';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ServerTable from 'in-components/tables/ServerTable';
import SparkChart from 'in-components/SparkChart';
import Link from 'in-components/Link';

export default function Endpoints({ location, timeframe, data }) {
  const { types } = data;
  const appId = getMatrixParameter(location, serviceDashboard, applicationId);
  const serviceID = getMatrixParameter(location, serviceDashboard, serviceId);

  return (
    <MaxWidthFullscreenContainer>
      {types.map(endpointType => (
        <Fragment key={endpointType}>
          <h3>{translation(endpointType)}</h3>
          <ServerTable
            get={getTableData}
            applicationId={appId}
            serviceId={serviceID}
            endpointType={endpointType}
            pageSize={10}
            timeframe={timeframe}
            columnDefinitions={getColumnDefinitions(timeframe, data.label, appId, serviceID)}
          />
        </Fragment>
      ))}
    </MaxWidthFullscreenContainer>
  );
}

function getTableData({ page, pageSize, orderBy, orderDirection, applicationId, serviceId, endpointType, timeframe }) {
  return getEndpoints({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      application: applicationId,
      service: serviceId,
      endpointType,
      timeframe
    },
    metrics: {
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      },
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeframe)
      },
      latencyAgg: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeframe)
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'MEAN'
      },
      errors: {
        metric: 'errors',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeframe)
      }
    }
  });
}

function getColumnDefinitions(timeframe, serviceLabel, appId, serviceId) {
  return [
    {
      id: 'endpointLabel',
      label: 'Method',
      getContent(item) {
        return <Link href$={getEndpointDashboard(item.endpoint.id, { appId, serviceId })}>{item.endpoint.label}</Link>;
      }
    },
    {
      id: 'serviceLabel',
      label: 'Service',
      getContent() {
        return serviceLabel;
      }
    },
    {
      id: 'callsAgg',
      label: 'Calls',
      getContent(item, { result }) {
        return (
          <SparkChart
            rollup={getSparkChartGranularity(timeframe)}
            timeframe={getResolvedTimeframe(timeframe, result)}
            metrics={item.metrics.calls}
            metric={item.metrics.callsAgg}
            tooltipFormatter={number.compact}
          />
        );
      }
    },
    {
      id: 'latencyAgg',
      label: 'Latency',
      getContent(item, { result }) {
        return (
          <SparkChart
            rollup={getSparkChartGranularity(timeframe)}
            timeframe={getResolvedTimeframe(timeframe, result)}
            metrics={item.metrics.latency}
            metric={item.metrics.latencyAgg}
            tooltipFormatter={ms.compact}
          />
        );
      }
    },
    {
      id: 'errorsAgg',
      label: 'Errors',
      getContent(item, { result }) {
        return (
          <SparkChart
            rollup={getSparkChartGranularity(timeframe)}
            timeframe={getResolvedTimeframe(timeframe, result)}
            metrics={item.metrics.errors}
            metric={item.metrics.errorsAgg}
            tooltipFormatter={percentage.compact}
          />
        );
      }
    }
  ];
}
