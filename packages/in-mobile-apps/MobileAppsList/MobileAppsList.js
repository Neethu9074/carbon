/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button, Card, Link } from '@instana/components';

import MobileAppsNoDataNotification from 'in-mobile-apps/MobileAppsList/components/MobileAppsNoDataNotification';
import { mobileAppsPath, useGetLinkToMobileApp, useLinkToNewMobileApp } from 'in-mobile-apps/navigation/paths';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { timeConfig$, urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-mobile-apps/metrics';
import { playwithEnabled, mobileAppCrashBeaconEnabled } from 'in-services/featureFlags';
import { getMobileAppsWithDefaults } from 'in-mobile-apps/subscriptions/getMobileApps';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import ViewSwitcher from 'in-websites/WebsitesList/components/ViewSwitcher';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { number, percentage } from 'in-services/formatters/number';
import { mobileAppsOpenAddForm } from 'in-mobile-apps/tracker';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
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
      return <MobileAppLabel item={item} />;
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
  },
  ...(mobileAppCrashBeaconEnabled
    ? [
        {
          id: 'crashesAgg',
          label: t('in-mobile-apps:appsList.crashFreeSessionRateLabel'),
          defaultOrderDirection: 'ASC',
          getContent(item, { result, timeConfig }) {
            return (
              <SparkChart
                loading={result?.progress?.loading}
                rollup={getSparkChartGranularity(timeConfig)}
                timeConfig={getResolvedTimeConfig(timeConfig, result)}
                aggregation="MEAN"
                metrics={item.metrics.crashes}
                metric={item.metrics.crashesAgg}
                tooltipFormatter={percentage.detailed}
                percentageMetric
              />
            );
          }
        }
      ]
    : [])
];

function MobileAppLabel({ item }) {
  const linkToMobileAppHref = useGetLinkToMobileApp(item.mobileApp.id);
  return <Link href={linkToMobileAppHref}>{item.mobileApp.label}</Link>;
}

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'sessionsAgg',
  defaultOrderDirection: 'DESC',
  pathSegment: mobileAppsPath
});

function RightHeader() {
  const linkToNewMobileApp = useLinkToNewMobileApp();
  if (playwithEnabled) return null;
  return (
    <Button
      kind="action"
      onClick={() => mobileAppsOpenAddForm()}
      className={locals.button}
      icon="lib_openclose_add_circle_outline"
      href={linkToNewMobileApp}
    >
      {t('in-mobile-apps:appsList.addMobileAppBtn')}
    </Button>
  );
}

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
              <ServerTableWithUrlState
                get={getTableData}
                timeConfig={timeConfig}
                rightHeader={role.canConfigureMobileAppMonitoring ? RightHeader : null}
              />
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
