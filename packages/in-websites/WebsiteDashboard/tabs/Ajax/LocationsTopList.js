/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import { TopListWithUrlState } from 'in-new-components/TopListWithUrlState';
import { ms, number, percentage } from 'in-services/formatters/number';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

const metrics = ['beaconCount', 'beaconDuration', 'beaconErrorRate'];
const labels = [
  t('in-websites:websiteDashboard.tabs.ajax.locationsTopListLabelCalls'),
  t('in-websites:websiteDashboard.tabs.ajax.locationsTopListLabelLatency'),
  t('in-websites:websiteDashboard.tabs.ajax.locationsTopListLabelErrors')
];
const aggregations = ['SUM', 'MEAN', 'MEAN'];
const formatters = [number.compact, ms.compact, percentage.detailed];

export default function LocationsTopList({ websiteId, websiteLabel, timeConfig, tagFilters, urlMatrixParamConfig }) {
  const tagCatalogHttpRequest = useTagCatalog('httpRequest');
  return (
    <TopListWithUrlState
      title={t('in-websites:websiteDashboard.tabs.ajax.locationsTopListTitle')}
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      Renderer={TopListCardPresenter}
      ViewAll={ViewAll}
      Label={Label}
      Metric={Metric}
      websiteId={websiteId}
      websiteLabel={websiteLabel}
      timeConfig={timeConfig}
      tagFilters={tagFilters}
      urlMatrixParamConfig={urlMatrixParamConfig}
      tagCatalogHttpRequest={tagCatalogHttpRequest}
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

function ViewAll({ tagFilters, websiteLabel, tagCatalogHttpRequest, className }) {
  return (
    <Link
      className={className}
      href$={
        tagCatalogHttpRequest &&
        getLinkToAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            websiteLabel,
            tagFilters,
            tagCatalog: tagCatalogHttpRequest
          }),
          beaconType: 'httpRequest',
          groupBy: {
            groupbyTag: 'beacon.http.path'
          }
        })
      }
    >
      {t('in-websites:websiteDashboard.tabs.ajax.locationsTopListLinkLabel')}
    </Link>
  );
}

function Label({ item, websiteLabel, tagFilters, tagCatalogHttpRequest }) {
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  return (
    <Link
      href$={
        tagCatalogHttpRequest &&
        getLinkToAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            websiteLabel,
            tagFilters: tagFilters.concat({ name: 'beacon.http.path', stringValue: label, operator: 'EQUALS' }),
            tagCatalog: tagCatalogHttpRequest
          }),
          beaconType: 'httpRequest',
          groupBy: {}
        })
      }
    >
      {label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
