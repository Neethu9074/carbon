/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import { TopListWithUrlState } from 'in-components/TopListWithUrlState';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metrics = ['beaconCount'];
const labels = [t('in-websites:websiteDashboard.tabs.ajax.errorTypesTopListLabelCalls')];
const aggregations = ['SUM'];
const formatters = [number.compact];

export default function ErrorTypesTopList({ websiteId, websiteLabel, timeConfig, tagFilters }) {
  const tagCatalogHttpRequest = useTagCatalog('httpRequest');
  return (
    <TopListWithUrlState
      title={t('in-websites:websiteDashboard.tabs.ajax.errorTypesTopListTitle')}
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
            groupbyTag: 'beacon.error.type'
          }
        })
      }
    >
      {t('in-websites:websiteDashboard.tabs.ajax.errorTypesTopListLinkLabel')}
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
            tagFilters: tagFilters.concat({ name: 'beacon.error.type', stringValue: label, operator: 'EQUALS' }),
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
