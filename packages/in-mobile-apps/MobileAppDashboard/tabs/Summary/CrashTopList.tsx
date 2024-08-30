/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { AggregationType } from '@instana/types';
import { Link } from '@instana/components';

// @ts-expect-error Could not find a declaration file for module
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
// @ts-expect-error Could not find a declaration file for module
import { TopListWithUrlState } from 'in-components/TopListWithUrlState';
import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { useGetLinkToMobileApp, useLinkToCrash } from 'in-mobile-apps/navigation/paths';
import { UrlMatrixParamConfig } from 'in-applications/types';
import { number } from 'in-services/formatters/number';
import { TagFilter, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

const metrics = ['crashAffectedSessionCount', 'uniqueUsersOrSessions'];
const labels = [
  t('in-mobile-apps:dashboard.tabs.occurrencesLabel'),
  t('in-mobile-apps:dashboard.tabs.affectedUsersLabel')
];
const aggregations = ['DISTINCT_COUNT', 'DISTINCT_COUNT'];
const formatters = [number.compact, number.compact];

export interface CrashTopListProps {
  mobileAppId: string;
  viewId?: string;
  timeConfig: TimeConfig;
  tagFilters?: Array<TagFilter>;
  urlMatrixParamConfig?: UrlMatrixParamConfig;
  renderHistoricDataIndicator: boolean;
}

export default function CrashTopList({
  mobileAppId,
  viewId,
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
      viewId={viewId}
      timeConfig={timeConfig}
      tagFilters={tagFilters}
      urlMatrixParamConfig={urlMatrixParamConfig}
      renderHistoricDataIndicator={renderHistoricDataIndicator}
      helpInfo={t('in-mobile-apps:dashboard.tabs.crashErrorGroupsHelpInfo')}
      noDataMessage={t('in-mobile-apps:dashboard.tabs.crashErrorGroupsNoDataMessage')}
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
    tagFilters: [
      {
        name: 'mobileBeacon.type',
        stringValue: 'crash',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        entity: 'NOT_APPLICABLE'
      },
      ...tagFilters
    ],
    timeConfig,
    pagination: {
      page: 1,
      pageSize: 4
    },
    order: {
      by: selectedMetric,
      direction: 'DESC'
    },
    group: {
      groupbyTag: 'mobileBeacon.crash.groupLabel'
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
  mobileAppId: string;
  viewId?: string;
  className: string;
}

function ViewAll({ mobileAppId, viewId, className }: ViewAllProps) {
  const mobileAppHref = useGetLinkToMobileApp(mobileAppId, { tabPath: '/crashes', viewId });

  return (
    <Link className={className} href={mobileAppHref}>
      {t('in-mobile-apps:dashboard.tabs.viewAllCrashes')}
    </Link>
  );
}

interface ItemWithName {
  name: string;
}

interface LabelProps {
  item: ItemWithName;
  mobileAppId: string;
  viewId?: string;
}

function Label({ item, mobileAppId, viewId }: LabelProps) {
  const getLinkToMobileAppCrash = useLinkToCrash();

  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  let errLocationLabel = label.split('\n')[0];
  let errorTypeLabel = label.split('\n')[1];
  return (
    <Link
      href={getLinkToMobileAppCrash(mobileAppId, {
        crashId: label,
        viewId
      })}
    >
      {errLocationLabel}
      <br />
      {errorTypeLabel}
    </Link>
  );
}

interface MetricProps {
  formattedMetricValue: any;
}

function Metric({ formattedMetricValue }: MetricProps) {
  return formattedMetricValue;
}
