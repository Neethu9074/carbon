/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { combineLatest } from '@instana/observables';
import { get } from 'lodash';
import React from 'react';

import WebsiteHealthIndicatorBehavior from 'in-websites/WebsiteDashboard/components/WebsiteHealthIndicatorBehavior/WebsiteHealthIndicatorBehavior';
import { website as websiteType, mobileApp as mobileAppType } from 'in-stores/starredItems/types';
import EmptyStateContent from 'in-cockpit/widgets/WebsitesAndMobileTopList/EmptyStateContent';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { getMobileAppsWithDefaults } from 'in-mobile-apps/subscriptions/getMobileApps';
import getMobileAppMetrics from 'in-mobile-apps/subscriptions/getMobileAppMetrics';
import { getWebsitesWithDefaults } from 'in-websites/subscriptions/getWebsites';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { hasWebsitesAccess, hasMobileAppsAccess } from 'in-stores/permission';
import getWebsiteMetrics from 'in-websites/subscriptions/getWebsiteMetrics';
import { number, meanLatencyFixed } from 'in-services/formatters/number';
import mergeResults from 'in-cockpit/widgets/TopListWidget/mergeResults';
import { linkToNewMobileApp$ } from 'in-mobile-apps/navigation/paths';
import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import HealthDot from 'in-new-components/health/HealthDot/HealthDot';
import getMobileApp from 'in-mobile-apps/subscriptions/getMobileApp';
import { websiteMonitoringPath } from 'in-websites/navigation/paths';
import { linkToNewWebsite$ } from 'in-websites/navigation/paths';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import { mobileAppsOpenAddForm } from 'in-mobile-apps/tracker';
import { hasError, isLoading } from 'in-services/util/result';
import TopListWidget from 'in-cockpit/widgets/TopListWidget';
import getWebsite from 'in-subscription/website/getWebsite';
import { getView } from 'in-stores/navigation/navigation';
import { websitesOpenAddForm } from 'in-websites/tracker';
import KeyValue from 'in-new-components/lists/KeyValue';
import { add, remove } from 'in-stores/starredItems';
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
      {hasMobileAppsAccess && role.canConfigureMobileAppMonitoring && (
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
    pinItem: (id, item) =>
      add({
        id,
        label: item.isWebsite ? item.website.label : item.mobileApp.label,
        type: getTypeByItem(item)
      }),
    unpinItem: (id, type) => remove({ id, type }),
    getItem,
    header,
    EmptyStateComponent: EmptyStateContent
  };

  if (!hasMobileAppsAccess) {
    return (
      <TopListWidget
        {...generalProps}
        fullListViewLinkTitle="All Websites"
        pinnedItemTypes={[websiteType]}
        getItems={getWebsites}
        getItemLink={item => getLinkToWebsite(getId(item))}
      />
    );
  }

  if (!hasWebsitesAccess) {
    return (
      <TopListWidget
        {...generalProps}
        fullListViewLinkTitle="All Mobile Apps"
        pinnedItemTypes={[mobileAppType]}
        getItems={getMobileApps}
        getItemLink={item => getLinkToMobileApp(getId(item))}
      />
    );
  }

  return (
    <TopListWidget
      {...generalProps}
      fullListViewLinkTitle="All Websites & Mobile Apps"
      pinnedItemTypes={[websiteType, mobileAppType]}
      getItems={getMergedData}
      getItemLink={item => (item.isWebsite ? getLinkToWebsite(getId(item)) : getLinkToMobileApp(getId(item)))}
    />
  );
}

function getId(item) {
  return item.isWebsite ? item.website.id : item.mobileApp.id;
}

function getTypeByItem(item) {
  return item.isWebsite ? websiteType : mobileAppType;
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
  if (type === websiteType) {
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
    width: '2rem',
    getContent({ item }) {
      if (!item.isWebsite) {
        return null;
      }
      return <WebsiteHealthInfo websiteId={getId(item)} />;
    }
  },
  {
    width: '3rem',
    getContent({ item }) {
      return <SvgIcon type={item.isWebsite ? 'lib_website' : 'lib_mobile_app'} />;
    }
  },
  {
    getContent({ item }) {
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
    width: '12rem',
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
          label={isWebsite ? 'Page Views' : 'Sessions'}
          tooltipFormatter={number.compact}
          showNullValuesChartOnEmptyMetrics
        />
      );
    }
  },
  {
    width: '12rem',
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
          label={isWebsite ? 'onLoad Time' : 'Views'}
          tooltipFormatter={isWebsite ? meanLatencyFixed.compact : number.compact}
          showDashOnMissingOrNullMetric
          hideChartOnEmptyMetrics
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
