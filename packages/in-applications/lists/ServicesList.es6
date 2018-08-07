import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { get } from 'lodash';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import { getServiceDashboard, servicesList, newServiceView } from 'in-applications/navigation/paths';
import { SeverityIndicatorCellContentWrapper } from 'in-components/tables/sharedComponents';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import Counter from 'in-components/tables/ServerTable/components/Counter';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { ms, percentage, number } from 'in-services/formatters/number';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import getServices from 'in-subscription/application/getServices';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import Filters from 'in-applications/components/Filters';
import { getColor } from 'in-applications/endpointTypes';
import { isNotBlank } from 'in-services/util/string';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import connect from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import Link from 'in-components/Link';

import locals from './ServicesList.mless';

const matrixPrefix = 'service.';

export default compose(
  connect({ timeConfig: timeConfig$ }),
  withUrlDependingState({
    getPathSegment: () => servicesList,
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
)(ServicesList);

function ServicesList({ timeConfig, setFilter, endpointTypes, technologies }) {
  const rightHeader = (
    <Fragment>
      {role.canConfigureServiceMapping && (
        <Button
          className={locals.button}
          icon="lib_actions_settings"
          kind="action"
          href$={getModifiedUrlStream(p => (p.pathname = newServiceView))}
        >
          Configure Services
        </Button>
      )}
      <Filters endpointTypes={endpointTypes} technologies={technologies} setFilter={setFilter} />
    </Fragment>
  );

  const leftHeader = <h1 className={locals.title}>Services</h1>;

  return (
    <Sticky header={<ViewSwitcher />}>
      <MaxWidthFullscreenContainer>
        <Title title="Services" />

        <ServerTableWithUrlBoundState
          get={getTableData}
          pathSegment={servicesList}
          matrixPrefix={matrixPrefix}
          columnDefinitions={columnDefinitions}
          timeConfig={timeConfig}
          endpointTypes={endpointTypes}
          technologies={technologies}
          paginationResettingProps={['timeConfig', 'endpointTypes']}
          rightHeader={rightHeader}
          leftHeader={leftHeader}
          defaultOrderBy="callsAgg"
          defaultOrderDirection="DESC"
        />
      </MaxWidthFullscreenContainer>
    </Sticky>
  );
}

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig, endpointTypes, technologies }) {
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
      applications: {
        metric: 'applications',
        aggregation: 'DISTINCT_COUNT'
      },
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
        aggregation: 'MAX'
      }
    },
    filter: {
      label: query,
      timeConfig,
      endpointTypes,
      technologies
    }
  });
}

const columnDefinitions = [
  {
    id: 'serviceLabel',
    label: 'Name',
    getContent(item) {
      return (
        <SeverityIndicatorCellContentWrapper severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}>
          <div className={locals.flexWrapper}>
            <SvgIcon className={locals.linkEntityIcon} type="lib_application_service" width={24} height={24} />
            <Link href$={getServiceDashboard(item.service.id)}>{item.service.label}</Link>
          </div>
        </SeverityIndicatorCellContentWrapper>
      );
    }
  },
  {
    id: 'Type',
    sortable: false,
    noWrap: true,
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
    noWrap: true,
    getContent(item) {
      return <TechnologyIndicatorList technologies={item.service.technologies} />;
    }
  },
  {
    id: 'applications',
    label: 'Applications',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      const count = get(item, ['metrics', 'applications', 0, 1], 0);
      return (
        <div className={locals.flexWrapper}>
          <SvgIcon className={locals.entityIcon} type="lib_application" width={24} height={24} />
          <Counter>{number.compact(count)}</Counter>
        </div>
      );
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
    id: 'maxSeverity',
    label: 'Health',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <ApplicationEntityHealthIndicatorBehavior
          serviceId={item.service.id}
          openIssues={get(item, ['metrics', 'openIssues', 0, 1], 0)}
          maxSeverity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          inContentArea
        />
      );
    }
  }
];
