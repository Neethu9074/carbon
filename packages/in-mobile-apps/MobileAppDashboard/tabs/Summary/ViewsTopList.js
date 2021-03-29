/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { TopListWithUrlState, trackTopListNavigation } from 'in-new-components/TopListWithUrlState';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

const metrics = ['views'];
const labels = [t('in-mobile-apps:dashboard.tabs.occurrencesLabel')];
const aggregations = ['SUM'];
const formatters = [number.compact, number.compact];

export default function ViewsTopList({ mobileAppId, timeConfig, tagFilters }) {
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
  return (
    <Link
      className={className}
      href$={getLinkToMobileApp(mobileAppId, {
        tabPath: '/views',
        tabParameters: {
          orderBy: `${selectedMetric}Agg`
        }
      })}
    >
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

  return (
    <Link
      onClick={() => trackTopListNavigation()}
      href$={getLinkToMobileApp(mobileAppId, {
        viewId: label,
        tabPath: '/summary'
      })}
    >
      {label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
