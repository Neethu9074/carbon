import { combineLatest } from 'reactive-observables';
import { get } from 'lodash';
import React from 'react';

import WebsiteHealthIndicatorBehavior from 'in-websites/WebsiteDashboard/components/WebsiteHealthIndicatorBehavior/WebsiteHealthIndicatorBehavior';
import EmptyStateContent from 'in-custom-dashboards/widgets/WebsitesAndMobileTopList/EmptyStateContent';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { getMobileAppsWithDefaults } from 'in-mobile-apps/subscriptions/getMobileApps';
import mergeResults from 'in-custom-dashboards/widgets/TopListWidget/mergeResults';
import getMobileAppMetrics from 'in-mobile-apps/subscriptions/getMobileAppMetrics';
import { getWebsitesWithDefaults } from 'in-websites/subscriptions/getWebsites';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { hasWebsitesAccess, hasMobileAppsAccess } from 'in-stores/permission';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { number, meanLatencyFixed } from 'in-services/formatters/number';
import TopListWidget from 'in-custom-dashboards/widgets/TopListWidget';
import { pin, unpin, types } from 'in-cockpit/pinnedItems/pinnedItems';
import { mobileAppMonitoringEnabled } from 'in-services/featureFlags';
import { linkToNewMobileApp$ } from 'in-mobile-apps/navigation/paths';
import HealthDot from 'in-new-components/health/HealthDot/HealthDot';
import getMobileApp from 'in-mobile-apps/subscriptions/getMobileApp';
import { websiteMonitoringPath } from 'in-websites/navigation/paths';
import { linkToNewWebsite$ } from 'in-websites/navigation/paths';
import { mobileAppsOpenAddForm } from 'in-mobile-apps/tracker';
import { hasError, isLoading } from 'in-services/util/result';
import getWebsite from 'in-subscription/website/getWebsite';
import { getView } from 'in-stores/navigation/navigation';
import { websitesOpenAddForm } from 'in-websites/tracker';
import KeyValue from 'in-new-components/lists/KeyValue';
import { timeConfig$ } from 'in-stores/time/config';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';

export default function WebsitesAndMobileTopList({ config }) {
  const header = (
    <>
      {role.canConfigureEumApplications && (
        <Button
          kind="action"
          onClick={() => websitesOpenAddForm()}
          icon="lib_openclose_add_circle_outline"
          href$={linkToNewWebsite$}
        >
          Add Website
        </Button>
      )}
      {mobileAppMonitoringEnabled &&
        hasMobileAppsAccess &&
        role.canConfigureMobileAppMonitoring && (
          <Button
            kind="action"
            onClick={() => mobileAppsOpenAddForm()}
            icon="lib_openclose_add_circle_outline"
            href$={linkToNewMobileApp$}
          >
            Add Mobile App
          </Button>
        )}
    </>
  );

  const generalProps = {
    ...config,
    columnDefinitions,
    fullListView$: getView(websiteMonitoringPath),
    getId,
    pinItem: (id, item) => pin(getTypeByItem(item), id),
    unpinItem: (id, item) => unpin(getTypeByItem(item), id),
    getItem,
    header,
    EmptyStateComponent: EmptyStateContent
  };

  if (!mobileAppMonitoringEnabled || !hasMobileAppsAccess) {
    return (
      <TopListWidget
        {...generalProps}
        fullListViewLinkTitle="All Websites"
        pinnedItemTypes={[types.WEBSITES]}
        getItems={getWebsites}
      />
    );
  }

  if (!hasWebsitesAccess) {
    return (
      <TopListWidget
        {...generalProps}
        fullListViewLinkTitle="All Mobile Apps"
        pinnedItemTypes={[types.MOBILE_APPS]}
        getItems={getMobileApps}
      />
    );
  }

  return (
    <TopListWidget
      {...generalProps}
      fullListViewLinkTitle="All Websites & Mobile Apps"
      pinnedItemTypes={[types.WEBSITES, types.MOBILE_APPS]}
      getItems={getMergedData}
    />
  );
}

function getId(item) {
  return item.isWebsite ? item.website.id : item.mobileApp.id;
}

function getTypeByItem(item) {
  return item.isWebsite ? types.WEBSITES : types.MOBILE_APPS;
}

function getWebsites(params) {
  return mergeResults([getWebsitesWithDefaults(params), 'isWebsite'])(sort);
}

function getMobileApps(params) {
  return mergeResults([getMobileAppsWithDefaults(params), 'isMobileApp'])(sort);
}

function getMergedData(params) {
  return mergeResults([getWebsitesWithDefaults(params), 'isWebsite', getMobileAppsWithDefaults(params), 'isMobileApp'])(
    sort
  );
}

function sort(a, b) {
  const mainKpiA = a.isWebsite
    ? get(a, ['metrics', 'pageViewsAgg', 0, 1], 0)
    : get(a, ['metrics', 'sessionsAgg', 0, 1], 0);
  const mainKpiB = b.isWebsite
    ? get(b, ['metrics', 'pageViewsAgg', 0, 1], 0)
    : get(b, ['metrics', 'sessionsAgg', 0, 1], 0);
  return mainKpiB - mainKpiA;
}

function getItem(id, timeConfig, type) {
  if (type === types.WEBSITES) {
    return getWebsiteById(id, timeConfig);
  }
  return getMobileAppById(id, timeConfig);
}

function getWebsiteById(id, timeConfig) {
  const granularity = getSparkChartGranularity(timeConfig);
  return combineLatest([
    getWebsite({ id }),
    getWebsiteMetrics({
      timeConfig,
      tagFilters: [{ name: 'beacon.website.id', operator: 'EQUALS', stringValue: id }],
      metrics: {
        pageViewsAgg: {
          metric: 'pageViews',
          aggregation: 'SUM'
        },
        pageViews: {
          metric: 'pageViews',
          aggregation: 'SUM',
          granularity
        },
        onLoadTimeAgg: {
          metric: 'onLoadTime',
          aggregation: 'MEAN'
        },
        onLoadTime: {
          metric: 'onLoadTime',
          aggregation: 'MEAN',
          granularity
        }
      }
    })
  ]).map(([websiteResult, metricResult]) => combineResults(websiteResult, metricResult, 'website', 'isWebsite'));
}

function getMobileAppById(id, timeConfig) {
  const granularity = getSparkChartGranularity(timeConfig);

  return combineLatest([
    getMobileApp({ id }),
    getMobileAppMetrics({
      timeConfig,
      tagFilters: [{ name: 'mobileBeacon.mobileApp.id', operator: 'EQUALS', stringValue: id }],
      metrics: {
        sessionsAgg: {
          metric: 'sessions',
          aggregation: 'SUM'
        },
        sessions: {
          metric: 'sessions',
          aggregation: 'SUM',
          granularity
        },
        viewsAgg: {
          metric: 'views',
          aggregation: 'SUM'
        },
        views: {
          metric: 'views',
          aggregation: 'SUM',
          granularity
        }
      }
    })
  ]).map(([mobileAppResult, metricResult]) =>
    combineResults(mobileAppResult, metricResult, 'mobileApp', 'isMobileApp')
  );
}

function combineResults(entityResult, metricResult, entityName, flag) {
  if (isLoading(entityResult) || hasError(entityResult)) {
    return entityResult;
  }
  if (isLoading(metricResult) || hasError(metricResult)) {
    return metricResult;
  }

  const mappedResult = {
    metrics: { ...metricResult.data },
    time: metricResult.time
  };
  mappedResult.mainKpiValue = get(
    metricResult.data,
    ['pageViewsAgg', 0, 1],
    get(metricResult.data, ['sessionsAgg', 0, 1], 0)
  );
  mappedResult[entityName] = entityResult.data;
  mappedResult[flag] = true;
  return mappedResult;
}

const columnDefinitions = [
  {
    column: 1,
    getContent(item) {
      if (!item.isWebsite) {
        return null;
      }
      return <WebsiteHealthInfo websiteId={getId(item)} />;
    }
  },
  {
    column: 2,
    getContent(item) {
      return <SvgIcon type={item.isWebsite ? 'lib_website' : 'lib_mobile_app'} />;
    }
  },
  {
    column: '3 / span 4',
    getContent(item) {
      const { isWebsite } = item;
      return (
        <KeyValue
          label={isWebsite ? 'Website' : 'Mobile App'}
          value={isWebsite ? item.website.label : item.mobileApp.label}
          inverted
          accentuated
        />
      );
    }
  },
  {
    column: 7,
    getContent(item, { result, timeConfig }) {
      const { isWebsite, metrics } = item;
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={isWebsite ? metrics.pageViews : metrics.sessions}
          metric={isWebsite ? metrics.pageViewsAgg : metrics.sessionsAgg}
          label={isWebsite ? 'Page Views' : 'Sessions'}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    column: 8,
    getContent(item, { result, timeConfig }) {
      const { isWebsite, metrics } = item;
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation={isWebsite ? 'MEAN' : 'SUM'}
          metrics={isWebsite ? metrics.onLoadTime : metrics.views}
          metric={isWebsite ? metrics.onLoadTimeAgg : metrics.viewsAgg}
          label={isWebsite ? 'onLoad Time' : 'Views'}
          tooltipFormatter={isWebsite ? meanLatencyFixed.compact : number.compact}
        />
      );
    }
  }
];

const WebsiteHealthInfo = connectTo({ timeConfig: timeConfig$ }, function WebsiteHealthInfo({ websiteId, timeConfig }) {
  return (
    <WebsiteHealthIndicatorBehavior
      websiteId={websiteId}
      timeConfig={timeConfig}
      render={healthInfo => (healthInfo ? <HealthDot severity={healthInfo.maxSeverity} iconSize={10} /> : null)}
    />
  );
});
