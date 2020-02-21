import { get } from 'lodash';
import React from 'react';

import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { getMobileAppsWithDefaults } from 'in-mobile-apps/subscriptions/getMobileApps';
import mergeResults from 'in-custom-dashboards/widgets/TopListWidget/mergeResults';
import { getWebsitesWithDefaults } from 'in-websites/subscriptions/getWebsites';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { number, meanLatencyFixed } from 'in-services/formatters/number';
import TopListWidget from 'in-custom-dashboards/widgets/TopListWidget';
import { pin, unpin, types } from 'in-cockpit/pinnedItems/pinnedItems';
import { mobileAppMonitoringEnabled } from 'in-services/featureFlags';
import { websiteMonitoringPath } from 'in-websites/navigation/paths';
import { getView } from 'in-stores/navigation/navigation';
import KeyValue from 'in-new-components/lists/KeyValue';

export default function WebsitesAndMobileTopList(props) {
  const generalProps = {
    ...props,
    columnDefinitions: columnDefinitions,
    fullListView$: getView(websiteMonitoringPath),
    getId,
    pinItem: (id, item) => pin(getTypeByItem(item), id),
    unpinItem: (id, item) => unpin(getTypeByItem(item), id)
  };

  if (!mobileAppMonitoringEnabled) {
    return (
      <TopListWidget
        {...generalProps}
        icon="lib_website_inverted"
        fullListViewLinkTitle="All Websites"
        pinnedItemTypes={[types.WEBSITES]}
        getItems={getWebsitesWithDefaults}
      />
    );
  }

  return (
    <TopListWidget
      {...generalProps}
      icon="lib_website_mobile_app_inverted"
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

function getMergedData(params) {
  return mergeResults(getWebsitesWithDefaults(params), 'isWebsite', getMobileAppsWithDefaults(params), 'isMobileApp')(
    (a, b) => {
      const mainKpiA = a.isWebsite
        ? get(a, ['metrics', 'pageViewsAgg', 0, 1], 0)
        : get(a, ['metrics', 'sessionsAgg', 0, 1], 0);
      const mainKpiB = b.isWebsite
        ? get(b, ['metrics', 'pageViewsAgg', 0, 1], 0)
        : get(b, ['metrics', 'sessionsAgg', 0, 1], 0);
      return mainKpiB - mainKpiA;
    }
  );
}

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
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
    id: 'metric1',
    label: 'Metric 1',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      const { isWebsite, metrics } = item;
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={!isWebsite ? metrics.sessions : metrics.pageViews}
          metric={!isWebsite ? metrics.sessionsAgg : metrics.pageViewsAgg}
          label={!isWebsite ? 'Sessions' : 'Page Views'}
          showAggregationIcon
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'metric2',
    label: 'Metric 2',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      const { isWebsite, metrics } = item;
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation={isWebsite ? 'MEAN' : 'SUM'}
          metrics={!isWebsite ? metrics.views : metrics.onLoadTime}
          metric={!isWebsite ? metrics.viewsAgg : metrics.onLoadTimeAgg}
          label={!isWebsite ? 'Views' : 'onLoad Time'}
          tooltipFormatter={isWebsite ? meanLatencyFixed.compact : number.compact}
          showAggregationIcon
        />
      );
    }
  }
];
