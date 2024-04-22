/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { TimeConfig, EntityHealthInfo } from '@instana/types';
import { Stack, SvgIcon, Link } from '@instana/components';
import { t } from '@instana/i18n-react';

//@ts-expect-error doesn't contain type file
import MobileHealthIndicatorBehavior from 'in-mobile-apps/MobileAppDashboard/components/MobileHealthIndicatorBehavior/MobileHealthIndicatorBehavior';
//@ts-expect-error doesn't contain type file
import WebsiteHealthIndicatorBehavior from 'in-websites/WebsiteDashboard/components/WebsiteHealthIndicatorBehavior/WebsiteHealthIndicatorBehavior';
//@ts-expect-error doesn't contain type file
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
//@ts-expect-error doesn't contain type file
import mergeResults from 'in-cockpit/widgets/TopListWidget/mergeResults';
import { GetContentFunction } from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import { useGenerateLinkToWebsite, websiteMonitoringPath } from 'in-websites/navigation/paths';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import { getMobileAppsWithDefaults } from 'in-mobile-apps/subscriptions/getMobileApps';
//@ts-expect-error doesn't contain type file
import connectTo from 'in-hoc/connectTo';
import { getWebsitesWithDefaults } from 'in-websites/subscriptions/getWebsites';
import { DashboardTileParamProps } from 'in-plg/pages/WelcomePage/PageContent';
import { useGenerateLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { meanLatencyFixed, number } from 'in-services/formatters/number';
import HealthDot from 'in-components/health/HealthDot/HealthDot';
import { playwithEnabled } from 'in-services/featureFlags';
import { timeConfig$ } from 'in-stores/time/config';
import DatatableWrapper from './DatatableWrapper';

const MobileAppHealthInfo = connectTo(
  { timeConfig: timeConfig$ },
  function MobileAppHealthInfo({ mobileAppId, timeConfig }: { mobileAppId: string; timeConfig: typeof timeConfig$ }) {
    return (
      <MobileHealthIndicatorBehavior
        mobileAppId={mobileAppId}
        timeConfig={timeConfig}
        render={(healthInfo: EntityHealthInfo) =>
          healthInfo ? <HealthDot severity={healthInfo.maxSeverity} iconSize={10} /> : null
        }
      />
    );
  }
);

const WebsiteHealthInfo = connectTo(
  { timeConfig: timeConfig$ },
  function WebsiteHealthInfo({ websiteId, timeConfig }: { websiteId: string; timeConfig: typeof timeConfig$ }) {
    return (
      <WebsiteHealthIndicatorBehavior
        websiteId={websiteId}
        timeConfig={timeConfig}
        render={(healthInfo: EntityHealthInfo) =>
          healthInfo ? <HealthDot severity={healthInfo.maxSeverity} iconSize={10} /> : null
        }
      />
    );
  }
);

function getId(item: any) {
  return item.isWebsite ? item.website.id : item.mobileApp.id;
}

function sort(a: any, b: any) {
  const mainKpiA = a.isWebsite
    ? get(a, ['metrics', 'pageViewsAgg', 0, 1], 0)
    : get(a, ['metrics', 'sessionsAgg', 0, 1], 0);
  const mainKpiB = b.isWebsite
    ? get(b, ['metrics', 'pageViewsAgg', 0, 1], 0)
    : get(b, ['metrics', 'sessionsAgg', 0, 1], 0);
  return mainKpiB - mainKpiA;
}

interface Params {
  timeConfig: TimeConfig;
  query: string;
}

function getWebsites(params: Params) {
  return mergeResults([getWebsitesWithDefaults(params), 'isWebsite'])(sort);
}

function getMobileApps(params: Params) {
  return mergeResults([getMobileAppsWithDefaults(params), 'isMobileApp'])(sort);
}

interface Props {
  config: any;
  timeConfig: typeof timeConfig$;
  type: string;
  widgetLabel: string;
  dashboardTileProps: DashboardTileParamProps;
}

export default connectTo(() => ({
  timeConfig: timeConfig$
}))(function WebsitesAndMobileTopListWidget({ type, config, timeConfig, widgetLabel, dashboardTileProps }: Props) {
  const { createHrefToPath, goToPath } = useNavigation();
  const getLinkToWebsite = useGenerateLinkToWebsite();
  const getLinkToMobileApp = useGenerateLinkToMobileApp();

  const getHeaders = () => {
    if (type === 'website') {
      return [
        {
          header: t('in-plg:welcomepage.component.websitesWidget.name'),
          key: 'name'
        },
        {
          header: t('in-plg:welcomepage.component.websitesWidget.pageViews'),
          key: 'pageViews'
        },
        {
          header: t('in-plg:welcomepage.component.websitesWidget.onLoadTimes'),
          key: 'onLoadTimes'
        }
      ];
    } else {
      return [
        {
          header: t('in-plg:welcomepage.component.mobileAppsWidget.name'),
          key: 'name'
        },
        {
          header: t('in-plg:welcomepage.component.mobileAppsWidget.sessions'),
          key: 'sessions'
        },
        {
          header: t('in-plg:welcomepage.component.mobileAppsWidget.views'),
          key: 'views'
        }
      ];
    }
  };

  interface columnDefinitionItem {
    key: string;
    getContent: GetContentFunction;
  }

  const columnDefinitions: columnDefinitionItem[] = [
    {
      key: 'name',
      getContent({ item }) {
        const { isWebsite } = item;
        const link = isWebsite ? getLinkToWebsite(getId(item)) : getLinkToMobileApp(getId(item));
        return (
          <Stack direction="horizontal" align="center">
            {item.isWebsite ? (
              <WebsiteHealthInfo websiteId={getId(item)} />
            ) : (
              <MobileAppHealthInfo mobileAppId={getId(item)} />
            )}
            <SvgIcon type={item.isWebsite ? 'lib_website' : 'lib_mobile_app'} />
            <Link href={link}>{isWebsite ? item.website.label : item.mobileApp.label}</Link>
          </Stack>
        );
      }
    },
    {
      key: type === 'website' ? 'pageViews' : 'sessions',
      getContent({ item, result, timeConfig }) {
        const { isWebsite, metrics } = item;
        return (
          <SparkChart
            loading={result?.progress?.loading}
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result)}
            aggregation="SUM"
            metrics={isWebsite ? metrics.pageViews : metrics.sessions}
            metric={isWebsite ? metrics.pageViewsAgg : metrics.sessionsAgg}
            tooltipFormatter={number.compact}
            showNullValuesChartOnEmptyMetrics
          />
        );
      }
    },
    {
      key: type === 'website' ? 'onLoadTimes' : 'views',
      getContent({ item, result, timeConfig }) {
        const { isWebsite, metrics } = item;
        return (
          <SparkChart
            loading={result?.progress?.loading}
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result)}
            aggregation={isWebsite ? 'MEAN' : 'SUM'}
            metrics={isWebsite ? metrics.onLoadTime : metrics.views}
            metric={isWebsite ? metrics.onLoadTimeAgg : metrics.viewsAgg}
            tooltipFormatter={isWebsite ? meanLatencyFixed.compact : number.compact}
            showDashOnMissingOrNullMetric
            hideChartOnEmptyMetrics
          />
        );
      }
    }
  ];
  const generalProps = {
    ...config,
    timeConfig,
    columnDefinitions,
    headers: playwithEnabled ? null : getHeaders()
  };

  function addNewWebsite() {
    goToPath('/websiteMonitoring/new');
  }

  function addNewMobileApp() {
    goToPath('/mobileAppMonitoring/new');
  }

  if (type === 'website') {
    return (
      <DatatableWrapper
        {...generalProps}
        getItems={getWebsites}
        viewAll
        hasAddMore
        addMore={addNewWebsite}
        addData={addNewWebsite}
        href={createHrefToPath(websiteMonitoringPath)}
        label={widgetLabel}
        dashboardTileProps={dashboardTileProps}
      />
    );
  }
  return (
    <DatatableWrapper
      {...generalProps}
      getItems={getMobileApps}
      viewAll
      hasAddMore
      addMore={addNewMobileApp}
      addData={addNewMobileApp}
      href={createHrefToPath(websiteMonitoringPath)}
      label={widgetLabel}
      dashboardTileProps={dashboardTileProps}
    />
  );
});
