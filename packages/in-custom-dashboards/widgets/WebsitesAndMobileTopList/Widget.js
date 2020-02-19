import { combineLatest } from 'reactive-observables';
import { get } from 'lodash';
import React from 'react';

import { getMobileAppsSubscribeEvent } from 'in-mobile-apps/MobileAppsList/MobileAppsList';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import { getWebsitesSubscribeEvent } from 'in-websites/WebsitesList/WebsitesList';
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
        getItems={getWebsitesSubscribeEvent}
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
  return item.website ? item.website.id : item.mobileApp.id;
}

function getTypeByItem(item) {
  return item.website ? types.WEBSITES : types.MOBILE_APPS;
}

function getMergedData(params) {
  return combineLatest([getWebsitesSubscribeEvent(params), getMobileAppsSubscribeEvent(params)]).map(
    ([websiteResult, mobileAppsResult]) => {
      const isWebsitesLoading = get(websiteResult, ['progress', 'loading']);
      const hasWebsitesErrors = get(websiteResult, ['errors', 'length'], 0) > 0;
      if (isWebsitesLoading || hasWebsitesErrors) {
        return websiteResult;
      }

      const isMobileAppsLoading = get(mobileAppsResult, ['progress', 'loading']);
      const hasMobileAppsErrors = get(mobileAppsResult, ['errors', 'length'], 0) > 0;
      if (isMobileAppsLoading || hasMobileAppsErrors) {
        return mobileAppsResult;
      }

      const mergedItems = [...websiteResult.data.items, ...mobileAppsResult.data.items].sort((a, b) => {
        const mainKpiA = get(a, ['metrics', 'pageViewsAgg', 0, 1], get(a, ['metrics', 'sessionsAgg', 0, 1], 0));
        const mainKpiB = get(b, ['metrics', 'pageViewsAgg', 0, 1], get(a, ['metrics', 'sessionsAgg', 0, 1], 0));
        return mainKpiB - mainKpiA;
      });
      return {
        progress: { loading: false },
        errors: [],
        time: websiteResult.time,
        adjustedWindowSize: websiteResult.adjustedWindowSize,
        data: {
          items: mergedItems
        }
      };
    }
  );
}

const columnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item) {
      return (
        <KeyValue
          label={item.website ? 'Website' : 'Mobile App'}
          value={get(item, ['website', 'label'], get(item, ['mobileApp', 'label'], ''))}
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
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={get(item, ['metrics', 'sessions'], get(item, ['metrics', 'pageViews']))}
          metric={get(item, ['metrics', 'sessionsAgg'], get(item, ['metrics', 'pageViewsAgg']))}
          label={get(item, ['metrics', 'sessions']) ? 'Sessions' : 'Page Views'}
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
      const isWebsite = !!item.website;
      return (
        <SparkChart
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation={isWebsite ? 'MEAN' : 'SUM'}
          metrics={get(item, ['metrics', 'views'], get(item, ['metrics', 'onLoadTime']))}
          metric={get(item, ['metrics', 'viewsAgg'], get(item, ['metrics', 'onLoadTimeAgg']))}
          label={get(item, ['metrics', 'views']) ? 'Views' : 'onLoad Time'}
          tooltipFormatter={isWebsite ? meanLatencyFixed.compact : number.compact}
          showAggregationIcon
        />
      );
    }
  }
];
