/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/legacy';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { useLinkToAnalyze, useLinkToWebsite } from 'in-websites/navigation/paths';
import { translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
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
  urlMatrixParamConfig,
  renderHistoricDataIndicator
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
      Renderer={TopListCardPresenter}
      ViewAll={ViewAll}
      Label={Label}
      Metric={Metric}
      websiteId={websiteId}
      websiteLabel={websiteLabel}
      timeConfig={timeConfig}
      tagFilters={tagFilters}
      beaconType={beaconType}
      tabPath={tabPath}
      urlMatrixParamConfig={urlMatrixParamConfig}
      tagCatalogs={tagCatalogs}
      renderHistoricDataIndicator={renderHistoricDataIndicator}
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

function ViewAll({ tagFilters, websiteLabel, beaconType, tagCatalogs, className }) {
  const analyzeHref = useLinkToAnalyze(
    tagCatalogs[beaconType] && {
      formModel: translateDemocratisationTagFiltersToFormModel({
        websiteLabel,
        tagFilters,
        tagCatalog: tagCatalogs[beaconType]
      }),
      beaconType,
      groupBy: {
        groupbyTag: 'beacon.page.name'
      }
    }
  );

  return (
    <Link className={className} href={analyzeHref}>
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

  const websiteHref = useLinkToWebsite(websiteId, {
    pageId: label,
    tabPath
  });

  return (
    <Link onClick={() => trackTopListNavigation()} href={websiteHref}>
      {label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
