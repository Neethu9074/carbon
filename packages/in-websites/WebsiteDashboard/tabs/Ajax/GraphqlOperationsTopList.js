/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import { TopListWithUrlState, trackTopListNavigation } from 'in-new-components/TopListWithUrlState';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { number, percentage, ms } from 'in-services/formatters/number';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import Link from 'in-components/Link';

const metrics = ['beaconCount', 'beaconDuration', 'beaconErrorRate'];
const labels = [
  t('in-websites:websiteDashboard.tabs.ajax.graphqlOperationsTopListLabelCalls'),
  t('in-websites:websiteDashboard.tabs.ajax.graphqlOperationsTopListLabelLatency'),
  t('in-websites:websiteDashboard.tabs.ajax.graphqlOperationsTopListLabelErrors')
];
const aggregations = ['SUM', 'MEAN', 'MEAN'];
const formatters = [number.compact, ms.compact, percentage.detailed];

export default function GraphqlOperationsTopList({
  websiteId,
  websiteLabel,
  timeConfig,
  tagFilters,
  urlMatrixParamConfig
}) {
  return (
    <TopListWithUrlState
      title={t('in-websites:websiteDashboard.tabs.ajax.graphqlOperationsTopListTitle')}
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
      groupbyTag: 'beacon.graphql.operationName'
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
        beaconType: 'httpRequest',
        group: {
          groupbyTag: 'beacon.graphql.operationName'
        }
      })}
    >
      View all GraphQL operation names
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
      onClick={() => trackTopListNavigation()}
      href$={getLinkToAnalyze({
        tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({
          websiteLabel,
          tagFilters: tagFilters.concat({
            name: 'beacon.graphql.operationName',
            stringValue: label,
            operator: 'EQUALS'
          })
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
