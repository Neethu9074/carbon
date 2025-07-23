/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { AggregationType, TagFilter, TimeConfig } from '@instana/types';
import { Link } from '@instana/components';

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
import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { useLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import { UrlMatrixParamConfig } from 'in-applications/types';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metrics = ['beaconCount', 'uniqueUsersOrSessions'];
const labels = [
  t('in-mobile-apps:dashboard.tabs.customEvents.osTopListLabelOccurrences'),
  t('in-mobile-apps:dashboard.tabs.customEvents.osTopListLabelUsers')
];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, affectedUsers.compact];
const beaconType = 'custom';

export interface OsTopListProp {
  mobileAppId: string;
  mobileAppLabel: string;
  timeConfig: TimeConfig;
  tagFilters: Array<TagFilter>;
  urlMatrixParamConfig?: UrlMatrixParamConfig;
}

export default function OsTopList({
  mobileAppId,
  mobileAppLabel,
  timeConfig,
  tagFilters,
  urlMatrixParamConfig
}: OsTopListProp) {
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

interface ViewAllProps {
  mobileAppLabel: string;
  tagFilters: Array<TagFilter>;
  className: string;
}

function ViewAll({ tagFilters, mobileAppLabel, className }: ViewAllProps) {
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

interface ItemWithName {
  name: string;
}

interface LabelProps {
  item: ItemWithName;
  mobileAppLabel: string;
  tagFilters: Array<TagFilter>;
}

function Label({ item, mobileAppLabel, tagFilters }: LabelProps) {
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
            tagFilters: tagFilters.concat({
              name: 'mobileBeacon.os.name',
              operator: 'EQUALS',
              stringValue: label,
              type: 'TAG_FILTER',
              entity: 'NOT_APPLICABLE'
            }),
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

interface MetricProps {
  formattedMetricValue: any;
}

function Metric({ formattedMetricValue }: MetricProps) {
  return formattedMetricValue;
}
