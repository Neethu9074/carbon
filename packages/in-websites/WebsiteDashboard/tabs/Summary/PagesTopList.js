/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/legacy';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { meanLatency, number } from 'in-services/formatters/number';
import { useLinkToWebsite } from 'in-websites/navigation/paths';
import { t } from 'in-i18n';

const metrics = ['pageViews', 'onLoadTime', 'errors'];
const labels = [
  t('in-websites:websiteDashboard.tabs.summary.pagesTopListLabelPageViews'),
  t('in-websites:websiteDashboard.tabs.summary.pagesTopListLabelOnLoadTime'),
  t('in-websites:websiteDashboard.tabs.summary.pagesTopListLabelErrors')
];
const aggregations = ['SUM', 'MEAN', 'SUM'];
const formatters = [number.compact, meanLatency.compact, number.compact];

export default function PagesTopList({ websiteId, timeConfig, tagFilters, urlMatrixParamConfig }) {
  return (
    <TopListWithUrlState
      title={t('in-websites:websiteDashboard.tabs.summary.pagesTopListTitleTopPages')}
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
      timeConfig={timeConfig}
      tagFilters={tagFilters}
      urlMatrixParamConfig={urlMatrixParamConfig}
      renderHistoricDataIndicator
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

function ViewAll({ websiteId, selectedMetric, className }) {
  const websiteHref = useLinkToWebsite(websiteId, {
    tabPath: '/pages',
    tabParameters: {
      orderBy: `${selectedMetric}Agg`
    }
  });

  return (
    <Link className={className} href={websiteHref}>
      {t('in-websites:websiteDashboard.tabs.summary.pagesTopListLinkLabel')}
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
    tabPath: '/summary'
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
