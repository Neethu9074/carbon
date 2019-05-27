import { get } from 'lodash';
import React from 'react';

import ApplicationEntityHealthIndicatorBehavior from 'in-applications/components/ApplicationEntityHealthIndicatorBehavior';
import { getApplicationDashboard, newApplicationView, applicationsList } from 'in-applications/navigation/paths';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import { number, meanLatencyFixed, percentage } from 'in-services/formatters/number';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import { applicationCreateClickedTracker } from 'in-applications/tracker';
import getApplications from 'in-subscription/application/getApplications';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import EmptyAppList from 'in-applications/lists/components/EmptyAppList';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import ListTitle from 'in-new-components/lists/Title';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';

import locals from './ApplicationsList.mless';

const rightHeader = role.canConfigureApplications && (
  <Button
    className={locals.button}
    kind="action"
    href$={getModifiedUrlStream(p => (p.pathname = newApplicationView))}
    onClick={() => applicationCreateClickedTracker()}
    icon="lib_openclose_add_circle_outline"
  >
    Create Application Perspective
  </Button>
);

export default connectTo(
  {
    timeConfig: timeConfig$,
    showNoApplicationsDefinedIndicator: timeConfig$
      .flatMap(timeConfig => getApplications(getApplicationListSubscribeEvent(timeConfig)))
      .map(result => result.data != null && result.data.items != null && result.data.items.length === 0)
  },
  function ApplicationsList({ timeConfig, showNoApplicationsDefinedIndicator }) {
    const leftHeader = <ListTitle>Application Perspectives</ListTitle>;

    return (
      <Sticky header={<ViewSwitcher />}>
        <MaxWidthFullscreenContainer>
          <Title title="Applications" />

          {!showNoApplicationsDefinedIndicator && (
            <ServerTableWithUrlBoundState
              get={getTableData}
              pathSegment={applicationsList}
              matrixPrefix="app."
              columnDefinitions={columnDefinitions}
              timeConfig={timeConfig}
              rightHeader={rightHeader}
              leftHeader={leftHeader}
              paginationResettingProps={['timeConfig']}
              defaultOrderBy="callsAgg"
              defaultOrderDirection="DESC"
            />
          )}

          {showNoApplicationsDefinedIndicator && <EmptyAppList />}
        </MaxWidthFullscreenContainer>
      </Sticky>
    );
  }
);

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeConfig }) {
  return getApplications(getApplicationListSubscribeEvent(timeConfig, page, pageSize, orderBy, orderDirection, query));
}

const columnDefinitions = [
  {
    id: 'applicationLabel',
    label: 'Name',
    getContent(item) {
      return (
        <SeverityAwareEntityLink
          severity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
          icon="lib_application"
          label={item.application.label}
          href$={getApplicationDashboard(item.application.id)}
        />
      );
    }
  },
  {
    id: 'services',
    label: 'Services',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      const count = get(item, ['metrics', 'services', 0, 1], 0);
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
          applicationId={item.application.id}
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

export function getApplicationListSubscribeEvent(
  timeConfig,
  page = 1,
  pageSize = 20,
  orderBy = 'callsAgg',
  orderDirection = 'DESC',
  query = ''
) {
  return {
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      services: {
        metric: 'services',
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
      timeConfig
    }
  };
}
