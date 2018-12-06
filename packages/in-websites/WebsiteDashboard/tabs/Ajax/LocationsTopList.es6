import React from 'react';

import getWebsitePaginatedBeaconGroups from 'in-subscription/websiteMonitoring/getWebsitePaginatedBeaconGroups';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import { ms, number } from 'in-services/formatters/number';
import TopList from 'in-new-components/TopList';
import Link from 'in-components/Link';

const metrics = ['beaconCount', 'beaconDuration', 'beaconErrorCount'];
const labels = ['Calls', 'Latency', 'Errors'];
const aggregations = ['SUM', 'MEAN', 'SUM'];
const formatters = [number.compact, ms.compact, number.compact];

export default function PagesTopList({ websiteId, websiteLabel, timeConfig, tagFilters }) {
  return (
    <TopList
      title="Paths"
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
      groupbyTag: 'beacon.http.path'
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
          groupbyTag: 'beacon.http.path'
        }
      })}
    >
      View All
    </Link>
  );
}

function Label({ item, websiteLabel, tagFilters }) {
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  return (
    <Link
      href$={getLinkToAnalyze({
        tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
          websiteLabel,
          tagFilters: tagFilters.concat({ name: 'beacon.http.path', stringValue: label, operator: 'EQUALS' })
        }),
        beaconType: 'httpRequest',
        group: {}
      })}
    >
      {label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
