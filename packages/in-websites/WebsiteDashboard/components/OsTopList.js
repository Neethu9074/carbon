/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import { TopListWithUrlState, trackTopListNavigation } from 'in-new-components/TopListWithUrlState';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import { getLinkToAnalyze } from 'in-websites/navigation/paths';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

export default function OsTopList({
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
      title={t('in-websites:websiteDashboard.components.osTopListTitle')}
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
      groupbyTag: 'beacon.os.name'
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
            groupbyTag: 'beacon.os.name'
          }
        })
      }
    >
      {t('in-websites:websiteDashboard.components.osTopListLinkLabel')}
    </Link>
  );
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
            tagFilters: tagFilters.concat({ name: 'beacon.os.name', operator: 'EQUALS', stringValue: label }),
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
