import { get } from 'lodash';
import React from 'react';

import { getApplicationDashboard, newApplicationView, applicationsList } from 'in-applications/navigation/paths';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import ApplicationEntityHealthBadge from 'in-applications/components/ApplicationEntityHealthBadge';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getApplications from 'in-subscription/application/getApplications';
import Counter from 'in-components/tables/ServerTable/components/Counter';
import EmptyAppList from 'in-applications/lists/components/EmptyAppList';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { number, ms, percentage } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';
import Link from 'in-components/Link';

import locals from './ApplicationsList.mless';

const rightHeader = role.canConfigureApplications && (
  <Button
    className={locals.button}
    kind="action"
    href$={getModifiedUrlStream(p => (p.pathname = newApplicationView))}
    icon="lib_openclose_add_circle_outline"
  >
    Create Application
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
    const leftHeader = <h1 className={locals.title}>Applications</h1>;

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
              paginationResettingProps={{ timeConfig }}
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
        <div className={locals.flexWrapper}>
          <SvgIcon className={locals.linkEntityIcon} type="lib_application" width={24} height={24} />
          <Link href$={getApplicationDashboard(item.application.id)}>{item.application.label}</Link>
        </div>
      );
    }
  },
  {
    id: 'maxSeverity',
    label: 'Health',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      return (
        <ApplicationEntityHealthBadge
          applicationId={item.application.id}
          openIssues={get(item, ['metrics', 'openIssues', 0, 1], 0)}
          maxSeverity={get(item, ['metrics', 'maxSeverity', 0, 1], 0)}
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
      return (
        <div className={locals.flexWrapper}>
          <SvgIcon className={locals.entityIcon} type="lib_application_service" width={24} height={24} />
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
        aggregation: 'DISTINCT_COUNT'
      }
    },
    filter: {
      label: query,
      timeConfig
    }
  };
}
