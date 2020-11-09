import React from 'react';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { TopListWithUrlState } from 'in-new-components/TopListWithUrlState';
import { number, ms, bytes } from 'in-services/formatters/number';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import Link from 'in-components/Link';

const metrics = ['beaconCount', 'beaconDuration', 'transferSize'];
const labels = ['Calls', 'Load Time', 'Size'];
const aggregations = ['SUM', 'MEAN', 'MEAN'];
const formatters = [number.compact, ms.compact, bytes.compact];

export default function ResourceTypesTopList({
  websiteId,
  websiteLabel,
  timeConfig,
  tagFilters,
  urlMatrixParamConfig
}) {
  return (
    <TopListWithUrlState
      title="Types"
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
      urlMatrixParamConfig={urlMatrixParamConfig}
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
      groupbyTag: 'beacon.resourceType'
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
        beaconType: 'resourceLoad',
        group: {
          groupbyTag: 'beacon.resourceType'
        }
      })}
    >
      View all types
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
          tagFilters: tagFilters.concat({ name: 'beacon.resourceType', stringValue: label, operator: 'EQUALS' })
        }),
        beaconType: 'resourceLoad',
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
