/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/legacy';

import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { useGetLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metrics = ['views'];
const labels = [t('in-mobile-apps:dashboard.tabs.occurrencesLabel')];
const aggregations = ['SUM'];
const formatters = [number.compact, number.compact];

export default function ViewsTopList({ mobileAppId, timeConfig, tagFilters, renderHistoricDataIndicator }) {
  return (
    <TopListWithUrlState
      title={t('in-mobile-apps:dashboard.tabs.topViewsTitle')}
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      Renderer={TopListCardPresenter}
      ViewAll={ViewAll}
      Label={Label}
      Metric={Metric}
      mobileAppId={mobileAppId}
      timeConfig={timeConfig}
      tagFilters={tagFilters}
      renderHistoricDataIndicator={renderHistoricDataIndicator}
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
      groupbyTag: 'mobileBeacon.view.name'
    },
    metrics: {
      [selectedMetric]: {
        metric: selectedMetric,
        aggregation: selectedMetricAggregation
      }
    }
  });
}

function ViewAll({ mobileAppId, selectedMetric, className }) {
  const linkToMobileAppHref = useGetLinkToMobileApp(mobileAppId, {
    tabPath: '/views',
    tabParameters: {
      orderBy: `${selectedMetric}Agg`
    }
  });

  return (
    <Link className={className} href={linkToMobileAppHref}>
      {t('in-mobile-apps:dashboard.tabs.viewAllViewsLink')}
    </Link>
  );
}

function Label({ item, mobileAppId }) {
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  const linkToMobileAppHref = useGetLinkToMobileApp(mobileAppId, {
    viewId: label,
    tabPath: '/summary'
  });

  return (
    <Link onClick={() => trackTopListNavigation()} href={linkToMobileAppHref}>
      {label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
