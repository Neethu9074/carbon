/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { useLinkToAnalyze, useLinkToWebsite } from 'in-websites/navigation/paths';
import { translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import { number, percentage } from 'in-services/formatters/number';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import { t } from 'in-i18n';

const metrics = ['beaconCount', 'beaconErrorRate'];
const labels = [
  t('in-websites:websiteDashboard.tabs.ajax.pagesTopListLabelCalls'),
  t('in-websites:websiteDashboard.tabs.ajax.pagesTopListLabelErrors')
];
const aggregations = ['SUM', 'MEAN'];
const formatters = [number.compact, percentage.detailed];

export default function PagesTopList({
  websiteId,
  websiteLabel,
  timeConfig,
  tagFilters,
  urlMatrixParamConfig,
  renderHistoricDataIndicator
}) {
  return (
    <TopListWithUrlState
      title={t('in-websites:websiteDashboard.tabs.ajax.pagesTopListTitle')}
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

function ViewAll({ tagFilters, websiteLabel, className }) {
  const tagCatalogHttpRequest = useTagCatalog('httpRequest');

  const analyzeHref = useLinkToAnalyze(
    tagCatalogHttpRequest && {
      formModel: translateDemocratisationTagFiltersToFormModel({
        websiteLabel,
        tagFilters,
        tagCatalog: tagCatalogHttpRequest
      }),
      beaconType: 'httpRequest',
      groupBy: {
        groupbyTag: 'beacon.page.name'
      }
    }
  );
  return (
    <Link className={className} href={analyzeHref}>
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

  const websiteHref = useLinkToWebsite(websiteId, {
    pageId: label,
    tabPath: '/ajax'
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
