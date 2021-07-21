/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';
import { Card } from '@instana/components';
import { Link } from '@instana/components';

import MobileAppsNoDataNotification from 'in-mobile-apps/MobileAppsList/components/MobileAppsNoDataNotification';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-mobile-apps/metrics';
import { getMobileAppsWithDefaults } from 'in-mobile-apps/subscriptions/getMobileApps';
import { mobileAppsPath, linkToNewMobileApp$ } from 'in-mobile-apps/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import ViewSwitcher from 'in-websites/WebsitesList/components/ViewSwitcher';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { mobileAppsOpenAddForm } from 'in-mobile-apps/tracker';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './MobileAppsList.mless';

const columnDefinitions = [
  {
    id: 'mobileAppLabel',
    label: t('in-mobile-apps:appsList.nameLabel'),
    getContent(item) {
      return <Link href$={getLinkToMobileApp(item.mobileApp.id)}>{item.mobileApp.label}</Link>;
    }
  },
  {
    id: 'sessionsAgg',
    label: t('in-mobile-apps:appsList.sessionStartsLabel'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.sessions}
          metric={item.metrics.sessionsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'viewsAgg',
    label: t('in-mobile-apps:appsList.viewTransitionsLabel'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.views}
          metric={item.metrics.viewsAgg}
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
    {t('in-mobile-apps:appsList.addMobileAppBtn')}
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
          <Title title={t('in-mobile-apps:appsList.mobileAppsTitle')} />
          <ViewTrackingMeta
            data={{
              productArea: 'EUM: Mobile Apps',
              pageRootName: 'Mobile Apps'
            }}
          />
          <WithEmptyStateFallback
            getHasDataToRender={getHasDataToRender}
            FallbackComponent={MobileAppsNoDataNotification}
          >
            <Card hasMarginBottom>
              <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} rightHeader={rightHeader} />
            </Card>
          </WithEmptyStateFallback>
        </LeftRightPadding>
        <Footer />
      </Sticky>
    );
  }
);

function getTableData(params) {
  return getMobileAppsWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getMobileAppsWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
