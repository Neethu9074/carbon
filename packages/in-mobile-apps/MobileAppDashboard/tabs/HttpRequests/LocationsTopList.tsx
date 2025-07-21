/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { AggregationType, TagFilter, TimeConfig } from '@instana/types';
import { Link } from '@instana/components';

// @ts-expect-error Could not find a declaration file for module
import { translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
// @ts-expect-error Could not find a declaration file for module
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
// @ts-expect-error Could not find a declaration file for module
import { TopListWithUrlState } from 'in-components/TopListWithUrlState';
// @ts-expect-error Could not find a declaration file for module
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { useLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import { UrlMatrixParamConfig } from 'in-applications/types';
import { ms, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metrics = ['beaconCount', 'beaconDuration', 'beaconErrorCount'];
const labels = [
  t('in-mobile-apps:dashboard.tabs.callsLabel'),
  t('in-mobile-apps:dashboard.tabs.latencyLabel'),
  t('in-mobile-apps:dashboard.tabs.errorsLabel')
];
const aggregations = ['SUM', 'MEAN', 'SUM'];
const formatters = [number.compact, ms.compact, number.compact];

export interface LocationsTopListProp {
  mobileAppId: string;
  mobileAppLabel: string;
  timeConfig: TimeConfig;
  tagFilters: Array<TagFilter>;
  urlMatrixParamConfig?: UrlMatrixParamConfig;
  renderHistoricDataIndicator: boolean;
}

export default function LocationsTopList({
  mobileAppId,
  mobileAppLabel,
  timeConfig,
  tagFilters,
  urlMatrixParamConfig,
  renderHistoricDataIndicator
}: LocationsTopListProp) {
  return (
    <TopListWithUrlState
      title={t('in-mobile-apps:dashboard.tabs.pathsTitle')}
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
      urlMatrixParamConfig={urlMatrixParamConfig}
      renderHistoricDataIndicator={renderHistoricDataIndicator}
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
      groupbyTag: 'mobileBeacon.http.path'
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
  const tagCatalogHttpRequest = useTagCatalog('httpRequest');
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();

  return (
    <Link
      className={className}
      href={
        tagCatalogHttpRequest &&
        getLinkToMobileAppAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            mobileAppLabel,
            tagFilters,
            tagCatalog: tagCatalogHttpRequest
          }),
          beaconType: 'httpRequest',
          groupBy: {
            groupbyTag: 'mobileBeacon.http.path'
          }
        })
      }
    >
      {t('in-mobile-apps:dashboard.tabs.viewAllPathsLink')}
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
  const tagCatalogHttpRequest = useTagCatalog('httpRequest');
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();

  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  return (
    <Link
      href={
        tagCatalogHttpRequest &&
        getLinkToMobileAppAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            mobileAppLabel,
            tagFilters: tagFilters.concat({
              name: 'mobileBeacon.http.path',
              stringValue: label,
              operator: 'EQUALS',
              type: 'TAG_FILTER',
              entity: 'NOT_APPLICABLE'
            }),
            tagCatalog: tagCatalogHttpRequest
          }),
          beaconType: 'httpRequest',
          groupBy: {}
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
