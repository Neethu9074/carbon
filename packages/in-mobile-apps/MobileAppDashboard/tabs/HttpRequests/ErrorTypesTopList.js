/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
import { TopListWithUrlState } from 'in-new-components/TopListWithUrlState';
import { getLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

const metrics = ['beaconCount'];
const labels = ['Calls'];
const aggregations = ['SUM'];
const formatters = [number.compact];

export default function ErrorTypesTopList({ mobileAppId, mobileAppLabel, timeConfig, tagFilters }) {
  return (
    <TopListWithUrlState
      title={t('in-mobile-apps:dashboard.tabs.errorTypesTitle')}
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
      groupbyTag: 'mobileBeacon.error.type'
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
  const tagCatalogHttpRequest = useTagCatalog('httpRequest');
  return (
    <Link
      className={className}
      href$={
        tagCatalogHttpRequest &&
        getLinkToAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            mobileAppLabel,
            tagFilters,
            tagCatalog: tagCatalogHttpRequest
          }),
          beaconType: 'httpRequest',
          groupBy: {
            groupbyTag: 'mobileBeacon.error.type'
          }
        })
      }
    >
      {t('in-mobile-apps:dashboard.tabs.viewAllErrorTypesLink')}
    </Link>
  );
}

function Label({ item, mobileAppLabel, tagFilters }) {
  const tagCatalogHttpRequest = useTagCatalog('httpRequest');
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
            mobileAppLabel,
            tagFilters: tagFilters.concat({ name: 'mobileBeacon.error.type', stringValue: label, operator: 'EQUALS' }),
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
