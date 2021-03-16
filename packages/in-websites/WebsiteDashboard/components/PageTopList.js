/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import { TopListWithUrlState, trackTopListNavigation } from 'in-new-components/TopListWithUrlState';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { getLinkToWebsite, getLinkToAnalyze } from 'in-websites/navigation/paths';
import { translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

export default function PageTopList({
  websiteId,
  websiteLabel,
  timeConfig,
  tagFilters,
  metrics,
  labels,
  aggregations,
  formatters,
  beaconType,
  tabPath,
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
      title={t('in-websites:websiteDashboard.components.pageTopListTitle')}
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
      beaconType={beaconType}
      tabPath={tabPath}
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

function ViewAll({ tagFilters, websiteLabel, beaconType, tagCatalogs }, className) {
  return (
    <Link
      className={className}
      href$={
        tagCatalogs[beaconType] &&
        getLinkToAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            websiteLabel,
            tagFilters,
            tagCatalog: tagCatalogs[beaconType]
          }),
          beaconType,
          groupBy: {
            groupbyTag: 'beacon.page.name'
          }
        })
      }
    >
      {t('in-websites:websiteDashboard.components.pageTopListLinkLabelViewAllPages')}
    </Link>
  );
}

function Label({ item, websiteId, tabPath }) {
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
        tabPath
      })}
    >
      {label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
