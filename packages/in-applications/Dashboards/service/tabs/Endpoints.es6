import { compose } from 'recompose';
import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import MetricValue from 'in-components/tables/ServerTable/components/MetricValue';
import { getEndpointTypesComboBoxItems } from 'in-applications/endpointTypes';
import { getEndpointDashboard } from 'in-applications/navigation/paths';
import { number, ms, percentage } from 'in-services/formatters/number';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import getEndpoints from 'in-subscription/application/getEndpoints';
import { getSparkChartGranularity } from 'in-applications/metrics';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { Row, Col } from 'in-new-components/layout/Grid';
import { getColor } from 'in-applications/endpointTypes';
import { isNotBlank } from 'in-services/util/string';
import ComboBox from 'in-components/ComboBox';
import Link from 'in-components/Link';

import locals from './Endpoints.mless';

const pathSegment = '/endpoints';
const matrixPrefix = 'endpoint.';

export default compose(
  withUrlDependingState({
    getPathSegment: () => pathSegment,
    getMatrixPrefix: () => matrixPrefix,
    boundKeys: ['endpointTypes'],
    getInitialState: () => ({ endpointTypes: [] }),
    reducerName: 'setEndpointTypes',
    reducer: (_, endpointTypes) => ({ endpointTypes: endpointTypes }),
    getParsedUrlValues: ({ endpointTypes }) => ({
      endpointTypes: endpointTypes == null ? null : endpointTypes.split(',').filter(isNotBlank)
    }),
    getSerializedUrlValues: ({ endpointTypes }) => ({
      endpointTypes: endpointTypes == null ? null : endpointTypes.join(',')
    })
  })
)(Endpoints);

function Endpoints({ timeframe, data, applicationId, serviceId, endpointId, endpointTypes, setEndpointTypes }) {
  const rightHeader = (
    <ComboBox
      value={endpointTypes}
      onChange={t => setEndpointTypes(t.map(a => a.value))}
      placeholder="Type…"
      multi
      options={getEndpointTypesComboBoxItems(data.types)}
      className={locals.filter}
    />
  );

  return (
    <Row>
      <Col xs={12}>
        <ServerTableWithUrlBoundState
          pathSegment={pathSegment}
          matrixPrefix={matrixPrefix}
          get={getTableData}
          applicationId={applicationId}
          serviceId={serviceId}
          endpointId={endpointId}
          timeframe={timeframe}
          columnDefinitions={columnDefinitions}
          cardTitle="Endpoints"
          rightHeader={rightHeader}
          endpointTypes={endpointTypes}
          paginationResettingProps={['applicationId', 'serviceId', 'endpointId', 'timeframe', 'endpointTypes']}
          defaultOrderBy="callsAgg"
          defaultOrderDirection="DESC"
        />
      </Col>
    </Row>
  );
}

function getTableData({
  page,
  pageSize,
  orderBy,
  orderDirection,
  applicationId,
  serviceId,
  endpointId,
  endpointTypes,
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
      endpoint: endpointId,
      endpointTypes,
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
    id: 'Type',
    sortable: false,
    getContent(item) {
      return (
        <Badge size="sm" color={getColor(item.endpoint.type)}>
          {item.endpoint.type}
        </Badge>
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
