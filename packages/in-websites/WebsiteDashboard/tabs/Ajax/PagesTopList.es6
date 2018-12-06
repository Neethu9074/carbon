import React from 'react';

import getWebsitePaginatedBeaconGroups from 'in-subscription/websiteMonitoring/getWebsitePaginatedBeaconGroups';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { getLinkToWebsite, getLinkToAnalyze } from 'in-websites/navigation/paths';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

const metrics = ['beaconCount', 'beaconErrorCount'];
const labels = ['Calls', 'Errors'];
const aggregations = ['SUM', 'SUM'];
const formatters = [number.compact, number.compact];

export default function PagesTopList({ websiteId, websiteLabel, timeConfig, tagFilters }) {
  return (
    <TopList
      title="Pages"
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      render={TopListCardPresenter}
      renderViewAll={ViewAll}
      renderLabel={Label}
      renderMetric={Metric}
      websiteId={websiteId}
      websiteLabel={websiteLabel}
      timeConfig={timeConfig}
      tagFilters={tagFilters}
    />
  );
}

function getList({ tagFilters, timeConfig, selectedMetric, selectedMetricAggregation }) {
  return getWebsitePaginatedBeaconGroups({
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
      groupbyTag: 'beacon.page.name'
    },
    metrics: {
      [selectedMetric]: {
        metric: selectedMetric,
        aggregation: selectedMetricAggregation
      }
    }
  });
}

function ViewAll({ tagFilters, websiteLabel }) {
  return (
    <Link
      href$={getLinkToAnalyze({
        tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({ websiteLabel, tagFilters }),
        beaconType: 'httpRequest',
        group: {
          groupbyTag: 'beacon.page.name'
        }
      })}
    >
      View All
    </Link>
  );
}

function Label({ item, websiteId }) {
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  return (
    <Link
      onClick={() => trackTopListNavigation()}
      href$={getLinkToWebsite(websiteId, {
        pageId: label,
        tabPath: '/ajax'
      })}
    >
      {label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
