import React from 'react';

import MobileAppsNoDataNotification from 'in-mobile-apps/MobileAppsList/components/MobileAppsNoDataNotification';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-mobile-apps/metrics';
import { mobileAppsPath, linkToNewMobileApp$ } from 'in-mobile-apps/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import ViewSwitcher from 'in-mobile-apps/MobileAppsList/components/ViewSwitcher';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import getMobileApps from 'in-mobile-apps/subscriptions/getMobileApps';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { mobileAppsOpenAddForm } from 'in-mobile-apps/tracker';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import Button from 'in-new-components/Button';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import Link from 'in-components/Link';
import { role } from 'in-stores/user';

import locals from './MobileAppsList.mless';

const columnDefinitions = [
  {
    id: 'mobileAppLabel',
    label: 'Name',
    getContent(item) {
      return <Link href$={getLinkToMobileApp(item.mobileApp.id)}>{item.mobileApp.label}</Link>;
    }
  },
  {
    id: 'sessionsAgg',
    label: 'Sessions',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.sessions}
          metric={item.metrics.sessionsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'sessionsAgg',
  defaultOrderDirection: 'DESC',
  pathSegment: mobileAppsPath
});

const rightHeader = role.canConfigureEumApplications && (
  <Button
    kind="action"
    onClick={() => mobileAppsOpenAddForm()}
    className={locals.button}
    icon="lib_openclose_add_circle_outline"
    href$={linkToNewMobileApp$}
  >
    Add Mobile App
  </Button>
);

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function MobileAppsList({ timeConfig }) {
    return (
      <Sticky header={<ViewSwitcher />}>
        <LeftRightPadding>
          <Title title="Mobile Apps" />
          <WithEmptyStateFallback
            getHasDataToRender={getHasDataToRender}
            FallbackComponent={MobileAppsNoDataNotification}
          >
            <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} rightHeader={rightHeader} />
          </WithEmptyStateFallback>
        </LeftRightPadding>
        <Footer />
      </Sticky>
    );
  }
);

function getTableData(params) {
  return getMobileAppsSubscribeEvent(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getMobileAppsSubscribeEvent({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}

function getMobileAppsSubscribeEvent({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'sessionsAgg',
  orderDirection = 'DESC',
  timeConfig
}) {
  return getMobileApps({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {
      sessionsAgg: {
        metric: 'sessions',
        aggregation: 'SUM'
      },
      sessions: {
        metric: 'sessions',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      }
    },
    labelFilter: query,
    timeConfig
  });
}
