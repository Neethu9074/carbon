import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import ApplicationEntityHealthBadge from 'in-applications/components/ApplicationEntityHealthBadge';
import { SeverityIndicatorCellContentWrapper } from 'in-components/tables/sharedComponents';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import Counter from 'in-components/tables/ServerTable/components/Counter';
import { ms, percentage, number } from 'in-services/formatters/number';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import getServices from 'in-subscription/application/getServices';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import Filters from 'in-applications/components/Filters';
import { getColor } from 'in-applications/endpointTypes';
import { isNotBlank } from 'in-services/util/string';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './Services.mless';

const pathSegment = '/services';
const matrixPrefix = 'service.';

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
)(ServiceList);

function ServiceList({ timeConfig, applicationId, serviceId, endpointId, endpointTypes, technologies, setFilter }) {
  const rightHeader = <Filters endpointTypes={endpointTypes} technologies={technologies} setFilter={setFilter} />;
  return (
    <ServerTableWithUrlBoundState
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      get={getTableData}
      columnDefinitions={columnDefinitions}
      timeConfig={timeConfig}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      cardTitle="Services"
      rightHeader={rightHeader}
      endpointTypes={endpointTypes}
      technologies={technologies}
      paginationResettingProps={['applicationId', 'endpointTypes', 'serviceId', 'endpointId', 'timeConfig']}
      defaultOrderBy="callsAgg"
      defaultOrderDirection="DESC"
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

const columnDefinitions = [
  {
    id: 'serviceLabel',
    label: 'Name',
    getContent(item, { applicationId, endpointId }) {
      return (
        <SeverityIndicatorCellContentWrapper severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}>
          <div className={locals.flexWrapper}>
            <SvgIcon className={locals.linkEntityIcon} type="lib_application_service" width={24} height={24} />
            <Link
              href$={getServiceDashboard(item.service.id, {
                applicationId,
                endpointId
              })}
            >
              {item.service.label}
            </Link>
          </div>
        </SeverityIndicatorCellContentWrapper>
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
      return (
        <div className={locals.flexWrapper}>
          <SvgIcon className={locals.entityIcon} type="lib_application_endpoint" width={24} height={24} />
          <Counter>{number.compact(count)}</Counter>
        </div>
      );
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
    id: 'openIssues',
    label: 'Issues',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      return (
        <ApplicationEntityHealthBadge
          serviceId={item.service.id}
          openIssues={get(item, ['metrics', 'openIssues', 0, 1], 0)}
          maxSeverity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
        />
      );
    }
  }
];
