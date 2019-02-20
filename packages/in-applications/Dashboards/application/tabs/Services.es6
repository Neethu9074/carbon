import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import { applicationDashboardUrlParameters } from 'in-applications/navigation/urlParameters';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import { percentage, meanLatencyFixed, number } from 'in-services/formatters/number';
import getServices from 'in-subscription/application/getServices';
import Filters from 'in-applications/components/Filters';
import { getColor } from 'in-applications/endpointTypes';
import withUrlState from 'in-hoc/withUrlState';

const pathSegment = '/services';
const matrixPrefix = 'service.';

const columnDefinitions = [
  {
    id: 'serviceLabel',
    label: 'Name',
    getContent(item, { applicationId, endpointId }) {
      return (
        <SeverityAwareEntityLink
          severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          icon="lib_application_service"
          label={item.service.label}
          href$={getServiceDashboard(item.service.id, {
            applicationId,
            endpointId
          })}
        />
      );
    }
  },
  {
    id: 'Type',
    sortable: false,
    getContent(item) {
      return (
        <Fragment>
          {item.service.types
            .slice()
            .sort()
            .map(type => (
              <Badge color={getColor(type)} key={type}>
                {type}
              </Badge>
            ))}
        </Fragment>
      );
    }
  },
  {
    id: 'Technology',
    sortable: false,
    getContent(item) {
      return <TechnologyIndicatorList technologies={item.service.technologies} />;
    }
  },
  {
    id: 'endpoints',
    label: 'Endpoints',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      const count = get(item, ['metrics', 'endpoints', 0, 1], 0);
      return <EntityCounter count={count} />;
    }
  },
  {
    id: 'callsAgg',
    label: 'Inbound Calls',
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
          tooltipFormatter={meanLatencyFixed.compact}
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
          serviceId={item.service.id}
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

const endpointTypesUrlParameter = {
  path: pathSegment,
  name: `${matrixPrefix}endpointTypes`,
  as: 'endpointTypes',
  initialState: [],
  parser: buildJsonParser([]),
  serializer: buildJsonSerializer()
};

const technologiesUrlParameter = {
  path: pathSegment,
  name: `${matrixPrefix}technologies`,
  as: 'technologies',
  initialState: [],
  parser: buildJsonParser([]),
  serializer: buildJsonSerializer()
};

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    endpointTypesUrlParameter,
    technologiesUrlParameter,
    applicationDashboardUrlParameters.applicationId,
    applicationDashboardUrlParameters.serviceId,
    applicationDashboardUrlParameters.endpointId
  ],
  columnDefinitions,
  defaultOrderBy: 'callsAgg',
  defaultOrderDirection: 'DESC',
  pathSegment,
  matrixPrefix
});

export default compose(
  withUrlState({
    bind: [endpointTypesUrlParameter, technologiesUrlParameter],
    reducerName: 'setFilter',
    reducer: (prevState, { endpointTypes, technologies }) => ({
      endpointTypes: endpointTypes || prevState.endpointTypes,
      technologies: technologies || prevState.technologies
    })
  })
)(ServiceList);

function ServiceList({ timeConfig, applicationId, serviceId, endpointId, endpointTypes, technologies, setFilter }) {
  const rightHeader = <Filters endpointTypes={endpointTypes} technologies={technologies} setFilter={setFilter} />;
  return (
    <ServerTableWithUrlState
      get={getTableData}
      timeConfig={timeConfig}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      cardTitle="Services"
      rightHeader={rightHeader}
      endpointTypes={endpointTypes}
      technologies={technologies}
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
  endpointTypes,
  technologies,
  timeConfig
}) {
  const granularity = getSparkChartGranularity(timeConfig);
  return getServices({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      endpoints: {
        metric: 'endpoints',
        aggregation: 'DISTINCT_COUNT'
      },
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      },
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity
      },
      latencyAgg: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      latency: {
        metric: 'latency',
        aggregation: 'MEAN',
        granularity
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'MEAN'
      },
      errors: {
        metric: 'errors',
        aggregation: 'MEAN',
        granularity
      },
      openIssues: {
        metric: 'openIssues',
        aggregation: 'DISTINCT_COUNT'
      },
      maxSeverity: {
        metric: 'maxSeverity',
        aggregation: 'DISTINCT_COUNT'
      }
    },
    filter: {
      label: query,
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      endpointTypes,
      technologies,
      timeConfig
    }
  });
}
