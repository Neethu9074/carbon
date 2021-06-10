/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import { t } from 'in-i18n';

export default function EffectiveConnectionTypeTopList({
  websiteId,
  websiteLabel,
  timeConfig,
  tagFilters,
  metrics,
  labels,
  aggregations,
  formatters,
  beaconType,
  urlMatrixParamConfig
}) {
  const tagCatalogs = {
    pageLoad: useTagCatalog('pageLoad'),
    pageChange: useTagCatalog('pageChange'),
    resourceLoad: useTagCatalog('resourceLoad'),
    httpRequest: useTagCatalog('httpRequest'),
    error: useTagCatalog('error'),
    custom: useTagCatalog('custom')
  };
  return (
    <TopListWithUrlState
      title={t('in-websites:websiteDashboard.components.effectiveConnectionTypeTopListTitle')}
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
      beaconType={beaconType}
      urlMatrixParamConfig={urlMatrixParamConfig}
      tagCatalogs={tagCatalogs}
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
      groupbyTag: 'beacon.effectiveConnectionType'
    },
    metrics: {
      [selectedMetric]: {
        metric: selectedMetric,
        aggregation: selectedMetricAggregation
      }
    }
  });
}

function ViewAll() {
  return null;
}

function Label({ item, websiteLabel, tagFilters, beaconType, tagCatalogs }) {
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  return (
    <Link
      onClick={() => trackTopListNavigation()}
      href$={
        tagCatalogs[beaconType] &&
        getLinkToAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            websiteLabel,
            tagFilters: tagFilters.concat({
              name: 'beacon.effectiveConnectionType',
              operator: 'EQUALS',
              stringValue: label
            }),
            tagCatalog: tagCatalogs[beaconType]
          }),
          beaconType,
          groupBy: {
            groupbyTag: 'beacon.browser.name'
          }
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
