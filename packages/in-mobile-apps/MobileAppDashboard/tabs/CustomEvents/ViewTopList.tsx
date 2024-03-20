/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { AggregationType } from '@instana/types';
import { Link } from '@instana/components';

// @ts-expect-error Could not find a declaration file for module
import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
// @ts-expect-error Could not find a declaration file for module
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
// @ts-expect-error Could not find a declaration file for module
import { translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
// @ts-expect-error Could not find a declaration file for module
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
// @ts-expect-error Could not find a declaration file for module
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
// @ts-expect-error Could not find a declaration file for module
import { affectedUsers } from 'in-websites/formatters';
import { useGetLinkToMobileApp, useLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import { UrlMatrixParamConfig } from 'in-applications/types';
import { number } from 'in-services/formatters/number';
import { TagFilter, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

const metrics = ['beaconCount', 'uniqueUsersOrSessions'];
const labels = [
  t('in-mobile-apps:dashboard.tabs.customEvents.viewTopListLabelOccurrences'),
  t('in-mobile-apps:dashboard.tabs.customEvents.viewTopListLabelUsers')
];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, affectedUsers.compact];
const beaconType = 'custom';
const tabPath = '/customEvents';

export interface ViewsTopListProp {
  mobileAppId: string;
  mobileAppLabel: string;
  timeConfig: TimeConfig;
  tagFilters: Array<TagFilter>;
  urlMatrixParamConfig?: UrlMatrixParamConfig;
}

export default function ViewTopList({
  mobileAppId,
  mobileAppLabel,
  timeConfig,
  tagFilters,
  urlMatrixParamConfig
}: ViewsTopListProp) {
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

interface GetListProps {
  tagFilters: Array<TagFilter>;
  timeConfig: TimeConfig;
  selectedMetric: string;
  selectedMetricAggregation: AggregationType;
}

function getList({ tagFilters, timeConfig, selectedMetric, selectedMetricAggregation }: GetListProps) {
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

interface ViewAllProps {
  mobileAppLabel: string;
  tagFilters: Array<TagFilter>;
  className: string;
}

function ViewAll({ tagFilters, mobileAppLabel, className }: ViewAllProps) {
  const tagCatalogCustom = useTagCatalog('custom');
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
            groupbyTag: 'mobileBeacon.view.name'
          }
        })
      }
    >
      {t('in-mobile-apps:dashboard.tabs.customEvents.viewTopListLinkLabel')}
    </Link>
  );
}

interface ItemWithName {
  name: string;
}

interface LabelProps {
  item: ItemWithName;
  mobileAppId: string;
}

function Label({ item, mobileAppId }: LabelProps) {
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

interface MetricProps {
  formattedMetricValue: any;
}

function Metric({ formattedMetricValue }: MetricProps) {
  return formattedMetricValue;
}
