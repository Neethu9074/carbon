import React from 'react';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

const metrics = ['errors', 'uniqueUsers'];
const labels = ['Occurrences', 'Affected Users'];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, affectedUsers.compact];

export default function BrowserTopList({ websiteId, websiteLabel, timeConfig, tagFilters }) {
  return (
    <TopList
      title="Browsers"
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
      groupbyTag: 'beacon.browser.name'
    },
    metrics: {
      [selectedMetric]: {
        metric: selectedMetric,
        aggregation: selectedMetricAggregation
      }
    }
  });
}

function ViewAll({ tagFilters, websiteLabel }, className) {
  return (
    <Link
      className={className}
      href$={getLinkToAnalyze({
        tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({ websiteLabel, tagFilters }),
        beaconType: 'error',
        group: {
          groupbyTag: 'beacon.browser.name'
        }
      })}
    >
      View all browsers
    </Link>
  );
}

function Label({ item, tagFilters, websiteLabel }) {
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  return (
    <Link
      onClick={() => trackTopListNavigation()}
      href$={getLinkToAnalyze({
        tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
          websiteLabel,
          tagFilters: tagFilters.concat({ name: 'beacon.browser.name', operator: 'EQUALS', stringValue: label })
        }),
        beaconType: 'error',
        group: {
          groupbyTag: 'beacon.os.name'
        }
      })}
    >
      {label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
