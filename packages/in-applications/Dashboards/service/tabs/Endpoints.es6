import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { getEndpointDashboard, configureEndpointsView } from 'in-applications/navigation/paths';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import { number, ms, percentage } from 'in-services/formatters/number';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import getEndpoints from 'in-subscription/application/getEndpoints';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import Filters from 'in-applications/components/Filters';
import { Row, Col } from 'in-new-components/layout/Grid';
import { getColor } from 'in-applications/endpointTypes';
import { isNotBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import { role } from 'in-stores/user';

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
  const hasHttpType = data.types.indexOf('HTTP') >= 0;
  const rightHeader = (
    <Fragment>
      {hasHttpType &&
        role.canConfigureServiceMapping && (
          <Button
            className={locals.button}
            icon="lib_actions_settings"
            kind="action"
            href$={getModifiedUrlStream(p => (p.pathname = configureEndpointsView))}
          >
            Configure Endpoints
          </Button>
        )}

      <Filters
        endpointTypes={endpointTypes}
        restrictedEndpointTypes={data.types}
        technologies={technologies}
        restrictedTechnologies={data.technologies}
        setFilter={setFilter}
      />
    </Fragment>
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
          getRowProps={getRowProps}
          rightHeader={rightHeader}
          endpointTypes={endpointTypes}
          technologies={technologies}
          paginationResettingProps={[
            'applicationId',
            'serviceId',
            'endpointId',
            'timeConfig',
            'endpointTypes',
            'technologies'
          ]}
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
      },
      openIssues: {
        metric: 'openIssues',
        aggregation: 'DISTINCT_COUNT'
      },
      maxSeverity: {
        metric: 'maxSeverity',
        aggregation: 'DISTINCT_COUNT'
      }
    }
  });
}

const getRowProps = item => {
  return { dull: item.endpoint.synthetic ? 1 : 0 };
};

const columnDefinitions = [
  {
    id: 'endpointLabel',
    label: 'Name',
    getContent(item, { applicationId, serviceId }) {
      return (
        <SeverityAwareEntityLink
          severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          icon="lib_application_endpoint"
          label={item.endpoint.label}
          href$={getEndpointDashboard(item.endpoint.label, { applicationId, serviceId })}
        />
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
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
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
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
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
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.errors}
          metric={item.metrics.errorsAgg}
          tooltipFormatter={percentage.detailed}
        />
      );
    }
  },
  {
    id: 'maxSeverity',
    label: 'Health',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <ApplicationEntityHealthIndicatorBehavior
          endpointId={item.endpoint.id}
          openIssues={get(item, ['metrics', 'openIssues', 0, 1], 0)}
          maxSeverity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          IndicatorPresenter={HealthIndicatorPresenter}
          inContentArea
        />
      );
    }
  }
];
