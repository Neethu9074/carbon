/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import { TopListWithUrlState } from 'in-new-components/TopListWithUrlState';
import { number, ms, bytes } from 'in-services/formatters/number';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

const metrics = ['beaconCount', 'beaconDuration', 'transferSize'];
const labels = [
  t('in-websites:websiteDashboard.tabs.resources.resourceTypesTopListLabelCalls'),
  t('in-websites:websiteDashboard.tabs.resources.resourceTypesTopListLabelLoadTime'),
  t('in-websites:websiteDashboard.tabs.resources.resourceTypesTopListLabelSize')
];
const aggregations = ['SUM', 'MEAN', 'MEAN'];
const formatters = [number.compact, ms.compact, bytes.compact];

export default function ResourceTypesTopList({
  websiteId,
  websiteLabel,
  timeConfig,
  tagFilters,
  urlMatrixParamConfig
}) {
  const tagCatalogResourceLoad = useTagCatalog('resourceLoad');
  return (
    <TopListWithUrlState
      title={t('in-websites:websiteDashboard.tabs.resources.resourceTypesTopListTitleTypes')}
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
      tagCatalogResourceLoad={tagCatalogResourceLoad}
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

function ViewAll({ tagFilters, websiteLabel, tagCatalogResourceLoad }, className) {
  return (
    <Link
      className={className}
      href$={
        tagCatalogResourceLoad &&
        getLinkToAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            websiteLabel,
            tagFilters,
            tagCatalog: tagCatalogResourceLoad
          }),
          beaconType: 'resourceLoad',
          groupBy: {
            groupbyTag: 'beacon.resourceType'
          }
        })
      }
    >
      {t('in-websites:websiteDashboard.tabs.resources.resourceTypesTopListLinkLabelViewAllTypes')}
    </Link>
  );
}

function Label({ item, websiteLabel, tagFilters, tagCatalogResourceLoad }) {
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  return (
    <Link
      href$={
        tagCatalogResourceLoad &&
        getLinkToAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            websiteLabel,
            tagFilters: tagFilters.concat({ name: 'beacon.resourceType', stringValue: label, operator: 'EQUALS' }),
            tagCatalog: tagCatalogResourceLoad
          }),
          beaconType: 'resourceLoad',
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
