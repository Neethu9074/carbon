import React from 'react';

import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-mobile-apps/tags';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { getLinkToMobileApp, getLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import { number, percentage } from 'in-services/formatters/number';
import Link from 'in-components/Link';

const metrics = ['beaconCount', 'beaconErrorRate'];
const labels = ['Calls', 'Errors'];
const aggregations = ['SUM', 'MEAN'];
const formatters = [number.compact, percentage.detailed];

export default function ViewsTopList({ mobileAppId, mobileAppLabel, timeConfig, tagFilters }) {
  return (
    <TopList
      title="Views"
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      render={TopListCardPresenter}
      renderViewAll={ViewAll}
      renderLabel={Label}
      renderMetric={Metric}
      mobileAppId={mobileAppId}
      mobileAppLabel={mobileAppLabel}
      timeConfig={timeConfig}
      tagFilters={tagFilters}
    />
  );
}

function getList({ tagFilters, timeConfig, selectedMetric, selectedMetricAggregation }) {
  return getMobileAppPaginatedBeaconGroups({
    tagFilters,
    timeConfig,
    pagination: {
      page: 1,
      pageSize: 5
    },
    order: {
      by: selectedMetric,
      direction: 'DESC'
    },
    group: {
      groupbyTag: 'mobileBeacon.view.name'
    },
    metrics: {
      [selectedMetric]: {
        metric: selectedMetric,
        aggregation: selectedMetricAggregation
      }
    }
  });
}

function ViewAll({ tagFilters, mobileAppLabel }, className) {
  return (
    <Link
      className={className}
      href$={getLinkToAnalyze({
        tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({ mobileAppLabel, tagFilters }),
        beaconType: 'httpRequest',
        group: {
          groupbyTag: 'mobileBeacon.view.name'
        }
      })}
    >
      View all views
    </Link>
  );
}

function Label({ item, mobileAppId }) {
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  return (
    <Link
      onClick={() => trackTopListNavigation()}
      href$={getLinkToMobileApp(mobileAppId, {
        viewId: label,
        tabPath: '/httpRequests'
      })}
    >
      {label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
