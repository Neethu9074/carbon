import React from 'react';

import MetricValue from 'in-components/tables/ServerTable/components/MetricValue';
import { getEndpointDashboard } from 'in-applications/navigation/paths';
import { number, ms, percentage } from 'in-services/formatters/number';
import getEndpoints from 'in-subscription/application/getEndpoints';
import { getSparkChartGranularity } from 'in-applications/metrics';
import { getEndpointsLabel } from 'in-applications/endpointTypes';
import ServerTable from 'in-components/tables/ServerTable';
import { Row, Col } from 'in-new-components/layout/Grid';
import Link from 'in-components/Link';

export default function Endpoints({ timeframe, data, applicationId, serviceId }) {
  const { types } = data;

  if (types.length === 0) {
    return 'No Endpoint types found';
  }
  return types.map(endpointType => (
    <Row key={endpointType}>
      <Col xs={12}>
        <ServerTable
          get={getTableData}
          applicationId={applicationId}
          serviceId={serviceId}
          endpointType={endpointType}
          pageSize={25}
          timeframe={timeframe}
          columnDefinitions={columnDefinitions}
          cardTitle={getEndpointsLabel(endpointType)}
          paginationResettingProps={{ applicationId, serviceId, timeframe }}
          defaultOrderBy="callsAgg"
          defaultOrderDirection="DESC"
        />
      </Col>
    </Row>
  ));
}

function getTableData({
  page,
  pageSize,
  orderBy,
  orderDirection,
  applicationId,
  serviceId,
  endpointType,
  timeframe,
  query
}) {
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
      endpointTypes: [endpointType],
      label: query,
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

const columnDefinitions = [
  {
    id: 'endpointLabel',
    label: 'Name',
    getContent(item, { applicationId, serviceId }) {
      return (
        <Link href$={getEndpointDashboard(item.endpoint.id, { applicationId, serviceId })}>{item.endpoint.label}</Link>
      );
    }
  },
  {
    id: 'callsAgg',
    label: 'Calls',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      return <MetricValue value={number.compact(item.metrics.callsAgg[0][1])} />;
    }
  },
  {
    id: 'latencyAgg',
    label: 'Latency',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      return <MetricValue value={ms.compact(item.metrics.latencyAgg[0][1])} />;
    }
  },
  {
    id: 'errorsAgg',
    label: 'Errors',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      return <MetricValue value={percentage.compact(item.metrics.errorsAgg[0][1])} />;
    }
  }
];
