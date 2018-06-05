import { compose } from 'recompose';
import React from 'react';

import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import MetricValue from 'in-components/tables/ServerTable/components/MetricValue';
import { getEndpointDashboard } from 'in-applications/navigation/paths';
import { number, ms, percentage } from 'in-services/formatters/number';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import getEndpoints from 'in-subscription/application/getEndpoints';
import { getSparkChartGranularity } from 'in-applications/metrics';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import Filters from 'in-applications/components/Filters';
import { Row, Col } from 'in-new-components/layout/Grid';
import { getColor } from 'in-applications/endpointTypes';
import { isNotBlank } from 'in-services/util/string';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Endpoints.mless';

const pathSegment = '/endpoints';
const matrixPrefix = 'endpoint.';

export default compose(
  withUrlDependingState({
    getPathSegment: () => pathSegment,
    getMatrixPrefix: () => matrixPrefix,
    boundKeys: ['endpointTypes', 'technologies'],
    getInitialState: () => ({ endpointTypes: [], technologies: [] }),
    reducerName: 'setFilter',
    reducer: (prevState, { endpointTypes, technologies }) => ({
      endpointTypes: endpointTypes ? endpointTypes : prevState.endpointTypes,
      technologies: technologies ? technologies : prevState.technologies
    }),
    getParsedUrlValues: ({ endpointTypes, technologies }) => ({
      endpointTypes: endpointTypes == null ? null : endpointTypes.split(',').filter(isNotBlank),
      technologies: technologies == null ? null : technologies.split(',').filter(isNotBlank)
    }),
    getSerializedUrlValues: ({ endpointTypes, technologies }) => ({
      endpointTypes: endpointTypes == null ? null : endpointTypes.join(','),
      technologies: technologies == null ? null : technologies.join(',')
    })
  })
)(Endpoints);

function Endpoints({ timeConfig, data, applicationId, serviceId, endpointId, endpointTypes, technologies, setFilter }) {
  const rightHeader = (
    <Filters
      endpointTypes={endpointTypes}
      restrictedEndpointTypes={data.types}
      technologies={technologies}
      restrictedTechnologies={data.technologies}
      setFilter={setFilter}
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
          technologies={technologies}
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
  technologies,
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
      technologies,
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
