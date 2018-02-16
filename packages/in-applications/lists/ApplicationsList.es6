import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSparkChartGranularity, getResolvedTimeframe } from 'in-applications/metrics';
import BreadcrumbHeader from 'in-applications/TabView/components/BreadcrumbHeader';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getApplications from 'in-subscription/application/getApplications';
import { getApplicationDashboard } from 'in-applications/navigation/paths';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { number, ms, percentage } from 'in-services/formatters/number';
import getMetrics from 'in-subscription/application/getMetrics';
import ServerTable from 'in-components/tables/ServerTable';
import { timeframe$ } from 'in-stores/timeline';
import Sticky from 'in-components/Sticky';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ApplicationList.mless';

export default connectTo(
  {
    timeframe: timeframe$,
    showNoApplicationsDefinedIndicator: timeframe$
      .flatMap(timeframe =>
        getMetrics({
          filter: {
            timeframe
          },
          metrics: {
            appCount: {
              metric: 'applications',
              aggregation: 'DISTINCT_COUNT'
            }
          }
        })
      )
      .map(result => result.data != null && result.data.appCount[0][1] < 1)
  },
  function ApplicationsList({ timeframe, showNoApplicationsDefinedIndicator }) {
    return (
      <Sticky header={<BreadcrumbHeader location={location} timeframe={timeframe} />}>
        <MaxWidthFullscreenContainer>
          <ViewSwitcher />
          <Button
            kind="default"
            key="createApplication"
            onClick={() => {}}
            className={locals.createApplication}
            size="sm"
            outlineOnly
          >
            Create Application
          </Button>

          {showNoApplicationsDefinedIndicator && <div>You got no applications, sorry bro!</div>}
          <ServerTable get={getTableData} pageSize={10} columnDefinitions={columnDefinitions} timeframe={timeframe} />
        </MaxWidthFullscreenContainer>
      </Sticky>
    );
  }
);

function getTableData({ query, page, pageSize, orderBy, orderDirection, timeframe }) {
  return getApplications({
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
    },
    filter: {
      label: query,
      timeframe
    }
  });
}

const columnDefinitions = [
  {
    id: 'applicationLabel',
    label: 'Name',
    getContent(item) {
      return <Link href$={getApplicationDashboard(item.application.id)}>{item.application.label}</Link>;
    }
  },
  {
    id: 'services',
    label: 'Services',
    getContent(item) {
      return number.compact(item.metrics.services[0][1]);
    }
  },
  {
    id: 'endpoints',
    label: 'Endpoints',
    getContent(item) {
      return number.compact(item.metrics.endpoints[0][1]);
    }
  },
  {
    id: 'callsAgg',
    label: 'Calls',
    getContent(item, { result, timeframe }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeframe)}
          timeframe={getResolvedTimeframe(timeframe, result)}
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
    getContent(item, { result, timeframe }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeframe)}
          timeframe={getResolvedTimeframe(timeframe, result)}
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
    getContent(item, { result, timeframe }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeframe)}
          timeframe={getResolvedTimeframe(timeframe, result)}
          metrics={item.metrics.errors}
          metric={item.metrics.errorsAgg}
          tooltipFormatter={percentage.compact}
        />
      );
    }
  }
];
