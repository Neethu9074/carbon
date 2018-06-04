import { compose } from 'recompose';
import React from 'react';

import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
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
import SvgIcon from 'in-components/SvgIcon';
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

function Endpoints({ timeConfig, data, applicationId, serviceId, endpointId, endpointTypes, setEndpointTypes }) {
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
          timeConfig={timeConfig}
          columnDefinitions={columnDefinitions}
          cardTitle="Endpoints"
          rightHeader={rightHeader}
          endpointTypes={endpointTypes}
          paginationResettingProps={['applicationId', 'serviceId', 'endpointId', 'timeConfig', 'endpointTypes']}
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
  timeConfig,
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
      timeConfig
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
      },
      latencyAgg: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'MEAN'
      },
      errors: {
        metric: 'errors',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
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
        <div className={locals.flexWrapper}>
          <SvgIcon className={locals.linkEntityIcon} type="lib_application_endpoint" width={24} height={24} />
          <Link href$={getEndpointDashboard(item.endpoint.id, { applicationId, serviceId })}>
            {item.endpoint.label}
          </Link>
        </div>
      );
    }
  },
  {
    id: 'Type',
    sortable: false,
    getContent(item) {
      return <Badge color={getColor(item.endpoint.type)}>{item.endpoint.type}</Badge>;
    }
  },
  {
    id: 'Technology',
    sortable: false,
    getContent(item) {
      return <TechnologyIndicatorList technologies={item.endpoint.technologies} />;
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
      return <MetricValue value={percentage.detailed(item.metrics.errorsAgg[0][1])} />;
    }
  }
];
