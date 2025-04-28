/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { AggregationType } from '@instana/types';
import { Link } from '@instana/components';

// @ts-expect-error Could not find a declaration file for module
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
// @ts-expect-error Could not find a declaration file for module
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { mobileAppScreenRenderingDurationEnabled } from 'in-services/featureFlags';
import { useGetLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { UrlMatrixParamConfig } from 'in-applications/types';
import { number, ms } from 'in-services/formatters/number';
import { TagFilter, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

const metrics = mobileAppScreenRenderingDurationEnabled ? ['views', 'beaconDuration'] : ['views'];
const labels = [
  t('in-mobile-apps:dashboard.tabs.occurrencesLabel'),
  t('in-mobile-apps:dashboard.tabs.screenrenderingDuartion')
];
const aggregations = ['SUM', 'P75'];
const formatters = [number.compact, ms.compact];

interface ViewsTopListProps {
  mobileAppId: string;
  timeConfig: TimeConfig;
  tagFilters?: Array<TagFilter>;
  urlMatrixParamConfig?: UrlMatrixParamConfig;
  renderHistoricDataIndicator: boolean;
}

export default function ViewsTopList({
  mobileAppId,
  timeConfig,
  tagFilters,
  urlMatrixParamConfig,
  renderHistoricDataIndicator
}: ViewsTopListProps) {
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
  mobileAppId: string;
  selectedMetric?: string;
  className: string;
}

function ViewAll({ mobileAppId, selectedMetric, className }: ViewAllProps) {
  const linkToMobileAppHref = useGetLinkToMobileApp(mobileAppId, {
    tabPath: '/views',
    tabParameters: {
      orderBy: `${selectedMetric}Agg`
    }
  });

  return (
    <Link className={className} href={linkToMobileAppHref}>
      {t('in-mobile-apps:dashboard.tabs.viewAllViewsLink')}
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
    tabPath: '/summary'
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
