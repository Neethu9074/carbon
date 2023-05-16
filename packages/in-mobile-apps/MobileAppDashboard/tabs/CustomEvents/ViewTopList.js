/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Link } from '@instana/components';

import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
import { getLinkToAnalyze, useGetLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metrics = ['beaconCount', 'uniqueUsers'];
const labels = [
  t('in-mobile-apps:dashboard.tabs.customEvents.viewTopListLabelOccurrences'),
  t('in-mobile-apps:dashboard.tabs.customEvents.viewTopListLabelUsers')
];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, affectedUsers.compact];
const beaconType = 'custom';
const tabPath = '/customEvents';

export default function ViewTopList({ mobileAppId, mobileAppLabel, timeConfig, tagFilters, urlMatrixParamConfig }) {
  return (
    <TopListWithUrlState
      title={t('in-mobile-apps:dashboard.tabs.customEvents.viewTopListTitle')}
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
      mobileAppLabel={mobileAppLabel}
      timeConfig={timeConfig}
      tagFilters={tagFilters}
      beaconType={beaconType}
      tabPath={tabPath}
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

function ViewAll({ tagFilters, mobileAppLabel, className }) {
  const tagCatalogCustom = useTagCatalog('custom');
  return (
    <Link
      className={className}
      href$={
        tagCatalogCustom &&
        getLinkToAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            mobileAppLabel,
            tagFilters,
            tagCatalog: tagCatalogCustom
          }),
          beaconType,
          groupBy: {
            groupbyTag: 'mobileBeacon.view.name'
          }
        })
      }
    >
      {t('in-mobile-apps:dashboard.tabs.customEvents.viewTopListLinkLabel')}
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
    tabPath
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
