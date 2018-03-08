import { get } from 'lodash';
import React from 'react';

import { getApplicationDashboard, newApplicationView } from 'in-applications/navigation/paths';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import MetricValue from 'in-components/tables/ServerTable/components/MetricValue';
import getApplications from 'in-subscription/application/getApplications';
import Counter from 'in-components/tables/ServerTable/components/Counter';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { number, ms, percentage } from 'in-services/formatters/number';
import { getSparkChartGranularity } from 'in-applications/metrics';
import getMetrics from 'in-subscription/application/getMetrics';
import ServerTable from 'in-components/tables/ServerTable';
import { timeframe$ } from 'in-stores/timeline';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import Link from 'in-components/Link';

import locals from './ApplicationsList.mless';

const leftHeader = (
  <Button
    kind="default"
    key="createApplication"
    href$={getModifiedUrlStream(p => (p.pathname = newApplicationView))}
    size="sm"
    outlineOnly
  >
    Create Application
  </Button>
);

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
      .map(result => result.data != null && (result.data.appCount.length == 0 || result.data.appCount[0][1] < 1))
  },
  function ApplicationsList({ timeframe, showNoApplicationsDefinedIndicator }) {
    return (
      <Sticky header={<ViewSwitcher />}>
        <MaxWidthFullscreenContainer className={locals.block}>
          <Title title="Applications" />
          <ServerTable
            get={getTableData}
            pageSize={25}
            columnDefinitions={columnDefinitions}
            timeframe={timeframe}
            leftHeader={leftHeader}
            paginationResettingProps={{ timeframe }}
            defaultOrderBy="callsAgg"
            defaultOrderDirection="DESC"
          />
          {showNoApplicationsDefinedIndicator && (
            <p className={locals.noApplicationsDefined}>
              No applications have been configured. You can add applications by clicking on the &quot;Create
              Application&quot; button above.
            </p>
          )}
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
      return (
        <div className={locals.flexWrapper}>
          <SvgIcon className={locals.entityIcon} type="app_application" width={24} height={24} color="#6c8a91" />
          <Link href$={getApplicationDashboard(item.application.id)}>{item.application.label}</Link>
        </div>
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
          <SvgIcon className={locals.entityIcon} type="app_service" width={18} height={20} color="#6c8a91" />
          <Counter>{number.compact(count)}</Counter>
        </div>
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
