/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
import { TopListWithUrlState } from 'in-new-components/TopListWithUrlState';
import { getLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import { ms, number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

const metrics = ['beaconCount', 'beaconDuration', 'beaconErrorCount'];
const labels = [
  t('in-mobile-apps:dashboard.tabs.callsLabel'),
  t('in-mobile-apps:dashboard.tabs.latencyLabel'),
  t('in-mobile-apps:dashboard.tabs.errorsLabel')
];
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
      title={t('in-mobile-apps:dashboard.tabs.pathsTitle')}
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
            groupbyTag: 'mobileBeacon.http.path'
          }
        })
      }
    >
      {t('in-mobile-apps:dashboard.tabs.viewAllPathsLink')}
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
            tagFilters: tagFilters.concat({ name: 'mobileBeacon.http.path', stringValue: label, operator: 'EQUALS' }),
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
