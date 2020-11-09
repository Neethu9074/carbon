import React from 'react';

import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-mobile-apps/tags';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { TopListWithUrlState } from 'in-new-components/TopListWithUrlState';
import { getLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import { ms, number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

const metrics = ['beaconCount', 'beaconDuration', 'beaconErrorCount'];
const labels = ['Calls', 'Latency', 'Errors'];
const aggregations = ['SUM', 'MEAN', 'SUM'];
const formatters = [number.compact, ms.compact, number.compact];

export default function LocationsTopList({
  mobileAppId,
  mobileAppLabel,
  timeConfig,
  tagFilters,
  urlMatrixParamConfig
}) {
  return (
    <TopListWithUrlState
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
      mobileAppId={mobileAppId}
      mobileAppLabel={mobileAppLabel}
      timeConfig={timeConfig}
      tagFilters={tagFilters}
      urlMatrixParamConfig={urlMatrixParamConfig}
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
      groupbyTag: 'mobileBeacon.http.path'
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
          groupbyTag: 'mobileBeacon.http.path'
        }
      })}
    >
      View all paths
    </Link>
  );
}

function Label({ item, mobileAppLabel, tagFilters }) {
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
          mobileAppLabel,
          tagFilters: tagFilters.concat({ name: 'mobileBeacon.http.path', stringValue: label, operator: 'EQUALS' })
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
