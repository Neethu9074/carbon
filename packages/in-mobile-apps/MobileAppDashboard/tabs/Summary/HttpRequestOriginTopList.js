/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import React from 'react';

import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { TopListWithUrlState, trackTopListNavigation } from 'in-new-components/TopListWithUrlState';
import { getLinkToMobileApp, getLinkToHttpRequest } from 'in-mobile-apps/navigation/paths';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metrics = ['beaconCount', 'beaconErrorRate'];
const labels = [t('in-mobile-apps:dashboard.tabs.callsLabel'), t('in-mobile-apps:dashboard.tabs.errorsLabel')];
const aggregations = ['SUM', 'MEAN'];
const formatters = [number.compact, percentage.detailed];

export default function HttpRequestOriginTopList({ mobileAppId, timeConfig, tagFilters, urlMatrixParamConfig }) {
  return (
    <TopListWithUrlState
      title={t('in-mobile-apps:dashboard.tabs.topHTTPRequestOriginsTitle')}
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
      urlMatrixParamConfig={urlMatrixParamConfig}
    />
  );
}

function getList({ tagFilters, timeConfig, selectedMetric, selectedMetricAggregation }) {
  return getMobileAppPaginatedBeaconGroups({
    tagFilters: tagFilters.concat([
      {
        name: 'mobileBeacon.type',
        stringValue: 'httpRequest',
        operator: 'EQUALS'
      }
    ]),
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
      groupbyTag: 'mobileBeacon.http.origin'
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
        tabPath: '/httpRequests',
        tabParameters: {
          orderBy: `${selectedMetric}Agg`
        }
      })}
    >
      {t('in-mobile-apps:dashboard.tabs.viewAllOriginsLink')}
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
      href$={getLinkToHttpRequest(mobileAppId, {
        httpRequestId: label
      })}
    >
      {label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
