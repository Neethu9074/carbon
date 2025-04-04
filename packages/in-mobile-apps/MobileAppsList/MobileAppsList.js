/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Link, Button } from '@instana/components';

import MobileHealthIndicatorBehavior from 'in-mobile-apps/MobileAppDashboard/components/MobileHealthIndicatorBehavior/MobileHealthIndicatorBehavior';
import { SeverityIndicatorCellContentWrapper } from 'in-components/tables/ServerTable/internalComponents/LegacySeverityIndicatorCellContentWrapper';
import {
  getTimeConfigAlignedToResultTime,
  timeConfig$,
  urlParameters as timeConfigUrlParameters
} from 'in-stores/time/config';
import MobileAppsNoDataNotification from 'in-mobile-apps/MobileAppsList/components/MobileAppsNoDataNotification';
import { mobileAppsPath, useGetLinkToMobileApp, useLinkToNewMobileApp } from 'in-mobile-apps/navigation/paths';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-mobile-apps/metrics';
import { playwithEnabled, mobileAppCrashBeaconEnabled } from 'in-services/featureFlags';
import { getMobileAppsWithDefaults } from 'in-mobile-apps/subscriptions/getMobileApps';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import ViewSwitcher from 'in-websites/WebsitesList/components/ViewSwitcher';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { useMobileTracker } from 'in-mobile-apps/tracking/segTracker';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { number, percentage } from 'in-services/formatters/number';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
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
          label: t('in-mobile-apps:appsList.crashAffectedSessionRateTitle'),
          defaultOrderDirection: 'DESC',
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
    : []),
  {
    id: 'maxSeverity',
    label: t('in-websites:websitesList.websitesListLabelHealth'),
    sortable: false,
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <MobileHealthIndicatorBehavior
          mobileAppId={item.mobileApp.id}
          openIssues={get(item, ['healthInfo', 'openIssues', 'length'], 0)}
          maxSeverity={get(item, ['healthInfo', 'maxSeverity'], 0)}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={getTimeConfigAlignedToResultTime(timeConfig, result)}
          inContentArea
        />
      );
    }
  }
];

function MobileAppLabel({ item }) {
  const linkToMobileAppHref = useGetLinkToMobileApp(item.mobileApp.id);
  return (
    <SeverityIndicatorCellContentWrapper severity={get(item, ['healthInfo', 'maxSeverity'], 0)}>
      <Link href={linkToMobileAppHref}>{item.mobileApp.label}</Link>
    </SeverityIndicatorCellContentWrapper>
  );
}

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'sessionsAgg',
  defaultOrderDirection: 'DESC',
  pathSegment: mobileAppsPath
});

function RightHeader() {
  const { mobileAppsOpenAddForm } = useMobileTracker();
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
        <LeftRightPadding className={locals.wrapper}>
          <Title title={t('in-mobile-apps:appsList.mobileAppsTitle')} />
          <ViewTrackingMeta
            data={{
              productArea: productAreas.websites_mobile_apps,
              pageRootName: pageNames.mobile_apps
            }}
          />
          <WithEmptyStateFallback
            getHasDataToRender={getHasDataToRender}
            FallbackComponent={MobileAppsNoDataNotification}
          >
            <ServerTableWithUrlState
              get={getTableData}
              timeConfig={timeConfig}
              rightHeader={role.canConfigureMobileAppMonitoring ? RightHeader : null}
            />
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
