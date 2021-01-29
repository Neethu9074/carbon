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
import { getLinkToWebsite, getLinkToAnalyze } from 'in-websites/navigation/paths';
import { number, percentage } from 'in-services/formatters/number';
import Link from 'in-components/Link';

const metrics = ['beaconCount', 'beaconErrorRate'];
const labels = [
  t('in-websites:websiteDashboard.tabs.ajax.pagesTopListLabelCalls'),
  t('in-websites:websiteDashboard.tabs.ajax.pagesTopListLabelErrors')
];
const aggregations = ['SUM', 'MEAN'];
const formatters = [number.compact, percentage.detailed];

export default function PagesTopList({ websiteId, websiteLabel, timeConfig, tagFilters, urlMatrixParamConfig }) {
  return (
    <TopListWithUrlState
      title={t('in-websites:websiteDashboard.tabs.ajax.pagesTopListTitle')}
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

function ViewAll({ tagFilters, websiteLabel }, className) {
  return (
    <Link
      className={className}
      href$={getLinkToAnalyze({
        tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({ websiteLabel, tagFilters }),
        beaconType: 'httpRequest',
        group: {
          groupbyTag: 'beacon.page.name'
        }
      })}
    >
      {t('in-websites:websiteDashboard.tabs.ajax.pagesTopListLinkLabel')}
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
