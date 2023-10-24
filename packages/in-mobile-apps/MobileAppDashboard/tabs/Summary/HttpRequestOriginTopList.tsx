/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { AggregationType } from '@instana/types';
import { Link } from '@instana/components';

// @ts-expect-error Could not find a declaration file for module
import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
// @ts-expect-error Could not find a declaration file for module
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
// @ts-expect-error Could not find a declaration file for module
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { useGetLinkToMobileApp, useLinkToHttpRequest } from 'in-mobile-apps/navigation/paths';
import { number, percentage } from 'in-services/formatters/number';
import { UrlMatrixParamConfig } from 'in-applications/types';
import { TagFilter, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

const metrics = ['beaconCount', 'beaconErrorRate'];
const labels = [t('in-mobile-apps:dashboard.tabs.callsLabel'), t('in-mobile-apps:dashboard.tabs.errorsLabel')];
const aggregations = ['SUM', 'MEAN'];
const formatters = [number.compact, percentage.detailed];

interface HttpRequestOriginTopListProp {
  mobileAppId: string;
  timeConfig: TimeConfig;
  tagFilters?: Array<TagFilter>;
  urlMatrixParamConfig?: UrlMatrixParamConfig;
  renderHistoricDataIndicator: boolean;
}

export default function HttpRequestOriginTopList({
  mobileAppId,
  timeConfig,
  tagFilters,
  urlMatrixParamConfig,
  renderHistoricDataIndicator
}: HttpRequestOriginTopListProp) {
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
    tagFilters: [
      {
        name: 'mobileBeacon.type',
        stringValue: 'httpRequest',
        operator: 'EQUALS',
        type: 'TAG_FILTER',
        entity: 'NOT_APPLICABLE'
      },
      ...tagFilters
    ],
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

interface ViewAllProps {
  mobileAppId: string;
  selectedMetric?: string;
  className: string;
}

function ViewAll({ mobileAppId, selectedMetric, className }: ViewAllProps) {
  const linkToMobileAppHref = useGetLinkToMobileApp(mobileAppId, {
    tabPath: '/httpRequests',
    tabParameters: {
      orderBy: `${selectedMetric}Agg`
    }
  });

  return (
    <Link className={className} href={linkToMobileAppHref}>
      {t('in-mobile-apps:dashboard.tabs.viewAllOriginsLink')}
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
  const getLinkToMobileAppHttpRequest = useLinkToHttpRequest();
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  return (
    <Link
      onClick={() => trackTopListNavigation()}
      href={getLinkToMobileAppHttpRequest(mobileAppId, {
        httpRequestId: label
      })}
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
