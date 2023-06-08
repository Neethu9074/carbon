/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Link } from '@instana/legacy';

import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
import { translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { useLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metrics = ['beaconCount', 'uniqueUsers'];
const labels = [
  t('in-mobile-apps:dashboard.tabs.customEvents.osTopListLabelOccurrences'),
  t('in-mobile-apps:dashboard.tabs.customEvents.osTopListLabelUsers')
];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, affectedUsers.compact];
const beaconType = 'custom';

export default function OsTopList({ mobileAppId, mobileAppLabel, timeConfig, tagFilters, urlMatrixParamConfig }) {
  return (
    <TopListWithUrlState
      title={t('in-mobile-apps:dashboard.tabs.customEvents.osTopListTitle')}
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
      groupbyTag: 'mobileBeacon.os.name'
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
  const tagCatalogCustom = useTagCatalog(beaconType);
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();

  return (
    <Link
      className={className}
      href={
        tagCatalogCustom &&
        getLinkToMobileAppAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            mobileAppLabel,
            tagFilters,
            tagCatalog: tagCatalogCustom
          }),
          beaconType,
          groupBy: {
            groupbyTag: 'mobileBeacon.os.name'
          }
        })
      }
    >
      {t('in-mobile-apps:dashboard.tabs.customEvents.osTopListLinkLabel')}
    </Link>
  );
}

function Label({ item, mobileAppLabel, tagFilters }) {
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();

  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }
  const tagCatalogCustom = useTagCatalog(beaconType);
  return (
    <Link
      onClick={() => trackTopListNavigation()}
      href={
        tagCatalogCustom &&
        getLinkToMobileAppAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            mobileAppLabel,
            tagFilters: tagFilters.concat({ name: 'mobileBeacon.os.name', operator: 'EQUALS', stringValue: label }),
            tagCatalog: tagCatalogCustom
          }),
          beaconType,
          groupBy: {
            groupbyTag: 'mobileBeacon.connectionType'
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
