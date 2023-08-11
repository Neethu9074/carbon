/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { AggregationType } from '@instana/types';
import { Link } from '@instana/legacy';

// @ts-expect-error Could not find a declaration file for module
import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
// @ts-expect-error Could not find a declaration file for module
import { translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
// @ts-expect-error Could not find a declaration file for module
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
// @ts-expect-error Could not find a declaration file for module
import { TopListWithUrlState } from 'in-components/TopListWithUrlState';
// @ts-expect-error Could not find a declaration file for module
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { useLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import { UrlMatrixParamConfig } from 'in-applications/types';
import { number } from 'in-services/formatters/number';
import { TagFilter, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

const metrics = ['beaconCount', 'uniqueUsers'];
const labels = [
  t('in-mobile-apps:dashboard.tabs.occurrencesLabel'),
  t('in-mobile-apps:dashboard.tabs.affectedUsersLabel')
];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, number.compact];

export interface CrashTopListProps {
  mobileAppId: string;
  mobileAppLabel: string;
  timeConfig: TimeConfig;
  tagFilters?: Array<TagFilter>;
  urlMatrixParamConfig?: UrlMatrixParamConfig;
  renderHistoricDataIndicator: boolean;
}

export default function CrashTopList({
  mobileAppId,
  mobileAppLabel,
  timeConfig,
  tagFilters,
  urlMatrixParamConfig,
  renderHistoricDataIndicator
}: CrashTopListProps) {
  return (
    <TopListWithUrlState
      title={t('in-mobile-apps:dashboard.tabs.crashErrorGroupsTitle')}
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
      helpInfo={t('in-mobile-apps:dashboard.tabs.crashErrorGroupsHelpInfo')}
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
    tagFilters: tagFilters.concat([
      {
        name: 'mobileBeacon.type',
        stringValue: 'crash',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        entity: 'NOT_APPLICABLE'
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
      groupbyTag: 'mobileBeacon.error.message'
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
  tagFilters?: Array<TagFilter>;
  className: string;
}

function ViewAll({ mobileAppLabel, tagFilters, className }: ViewAllProps) {
  const tagCatalogCrash = useTagCatalog('crash');
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();

  return (
    <Link
      className={className}
      href={
        tagCatalogCrash &&
        getLinkToMobileAppAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            mobileAppLabel,
            tagFilters,
            tagCatalog: tagCatalogCrash
          }),
          beaconType: 'crash',
          groupBy: {
            groupbyTag: 'mobileBeacon.error.message'
          },
          fields: [
            {
              metricId: 'uniqueUsers',
              aggregationId: 'DISTINCT_COUNT',
              type: metricType
            }
          ],
          chartedMetrics: [
            {
              metricId: 'uniqueUsers',
              aggregationId: 'DISTINCT_COUNT'
            },
            {
              metricId: 'beaconCount',
              aggregationId: 'SUM'
            }
          ]
        })
      }
    >
      {t('in-mobile-apps:dashboard.tabs.analyzeCrashesLink')}
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
  const tagCatalogCrash = useTagCatalog('crash');
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
        tagCatalogCrash &&
        getLinkToMobileAppAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            mobileAppLabel,
            tagFilters: tagFilters.concat({
              name: 'mobileBeacon.error.message',
              stringValue: label,
              operator: 'EQUALS',
              type: 'TAG_FILTER',
              entity: 'NOT_APPLICABLE'
            }),
            tagCatalog: tagCatalogCrash
          }),
          beaconType: 'crash',
          groupBy: {},
          fields: [
            {
              metricId: 'uniqueUsers',
              aggregationId: 'DISTINCT_COUNT',
              type: metricType
            }
          ],
          chartedMetrics: [
            {
              metricId: 'uniqueUsers',
              aggregationId: 'DISTINCT_COUNT'
            },
            {
              metricId: 'beaconCount',
              aggregationId: 'SUM'
            }
          ]
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
