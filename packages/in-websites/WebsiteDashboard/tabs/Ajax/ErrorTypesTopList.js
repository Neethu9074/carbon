/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import { translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { TopListWithUrlState } from 'in-new-components/TopListWithUrlState';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

const metrics = ['beaconCount'];
const labels = [t('in-websites:websiteDashboard.tabs.ajax.errorTypesTopListLabelCalls')];
const aggregations = ['SUM'];
const formatters = [number.compact];

export default function PagesTopList({ websiteId, websiteLabel, timeConfig, tagFilters }) {
  return (
    <TopListWithUrlState
      title={t('in-websites:websiteDashboard.tabs.ajax.errorTypesTopListTitle')}
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
      groupbyTag: 'beacon.error.type'
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
          groupbyTag: 'beacon.error.type'
        }
      })}
    >
      {t('in-websites:websiteDashboard.tabs.ajax.errorTypesTopListLinkLabel')}
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
          tagFilters: tagFilters.concat({ name: 'beacon.error.type', stringValue: label, operator: 'EQUALS' })
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
