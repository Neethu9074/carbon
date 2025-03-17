/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig, TagFilter, MobileAppPaginatedBeaconGroupsItem, AggregationType } from '@instana/types';
import { Link } from '@instana/components';

// @ts-expect-error Could not find a declaration file for module
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
// @ts-expect-error Could not find a declaration file for module
import { translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
// @ts-expect-error Could not find a declaration file for module
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
// @ts-expect-error Could not find a declaration file for module
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import getMoblieAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { useLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import { UrlMatrixParamConfig } from 'in-applications/types';
import { FormatterFn } from 'in-stores/metric/formatters';
import { MobileAppMonitoringBeaconType } from 'in-types';

interface MobileAppTopListProp {
  title: string;
  mobileAppId: string;
  mobileAppLabel: string;
  timeConfig: TimeConfig;
  tagFilters: TagFilter[];
  metrics: string[];
  labels: string[];
  aggregations: string[];
  formatters: FormatterFn[];
  beaconType: MobileAppMonitoringBeaconType;
  beaconGroupByFilter: string;
  linkToAllLabel: string;
  urlMatrixParamConfig?: UrlMatrixParamConfig;
  renderHistoricDataIndicator: boolean;
}

export default function MobileAppTopList({
  title,
  mobileAppId,
  mobileAppLabel,
  timeConfig,
  tagFilters,
  metrics,
  labels,
  aggregations,
  formatters,
  beaconType,
  beaconGroupByFilter,
  linkToAllLabel,
  urlMatrixParamConfig,
  renderHistoricDataIndicator
}: MobileAppTopListProp) {
  const tagCatalogs = {
    sessionStart: useTagCatalog('sessionStart'),
    viewChange: useTagCatalog('viewChange'),
    httpRequest: useTagCatalog('httpRequest'),
    crash: useTagCatalog('crash'),
    custom: useTagCatalog('custom'),
    dropBeacon: useTagCatalog('dropBeacon')
  };

  return (
    <TopListWithUrlState
      title={title}
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
      beaconGroupByFilter={beaconGroupByFilter}
      linkToAllLabel={linkToAllLabel}
      urlMatrixParamConfig={urlMatrixParamConfig}
      tagCatalogs={tagCatalogs}
      renderHistoricDataIndicator={renderHistoricDataIndicator}
    />
  );
}

interface GetListProp {
  tagFilters: TagFilter[];
  timeConfig: TimeConfig;
  selectedMetric: string;
  selectedMetricAggregation: AggregationType;
  beaconGroupByFilter: string;
}

function getList({
  tagFilters,
  timeConfig,
  selectedMetric,
  selectedMetricAggregation,
  beaconGroupByFilter
}: GetListProp) {
  return getMoblieAppPaginatedBeaconGroups({
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
      groupbyTag: beaconGroupByFilter
    },
    metrics: {
      [selectedMetric]: {
        metric: selectedMetric,
        aggregation: selectedMetricAggregation
      }
    }
  });
}

interface ViewAllProp {
  tagFilters: TagFilter[];
  mobileAppLabel: string;
  beaconType: string;
  tagCatalogs: any;
  className: string;
  beaconGroupByFilter: string;
  linkToAllLabel: string;
}

function ViewAll({
  tagFilters,
  mobileAppLabel,
  beaconType,
  tagCatalogs,
  className,
  beaconGroupByFilter,
  linkToAllLabel
}: ViewAllProp) {
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();

  return (
    <Link
      className={className}
      href={
        tagCatalogs[beaconType] &&
        getLinkToMobileAppAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            mobileAppLabel,
            tagFilters,
            tagCatalog: tagCatalogs[beaconType]
          }),
          beaconType,
          groupBy: {
            groupbyTag: beaconGroupByFilter
          }
        })
      }
    >
      {linkToAllLabel}
    </Link>
  );
}

interface LabelProp {
  item: MobileAppPaginatedBeaconGroupsItem;
  mobileAppLabel: string;
  tagFilters: TagFilter[];
  beaconType: string;
  tagCatalogs: any;
  beaconGroupByFilter: string;
}

function Label({ item, mobileAppLabel, tagFilters, beaconType, tagCatalogs, beaconGroupByFilter }: LabelProp) {
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();

  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  return (
    <Link
      onClick={() => trackTopListNavigation()}
      href={
        tagCatalogs[beaconType] &&
        getLinkToMobileAppAnalyze({
          formModel: translateDemocratisationTagFiltersToFormModel({
            mobileAppLabel,
            tagFilters: tagFilters.concat({
              name: beaconGroupByFilter,
              operator: 'EQUALS',
              stringValue: label,
              type: 'TAG_FILTER',
              entity: 'NOT_APPLICABLE'
            }),
            tagCatalog: tagCatalogs[beaconType]
          }),
          beaconType,
          groupBy: {}
        })
      }
    >
      {label}
    </Link>
  );
}

interface MetricProps {
  formattedMetricValue: string;
}

function Metric({ formattedMetricValue }: MetricProps) {
  return formattedMetricValue;
}
