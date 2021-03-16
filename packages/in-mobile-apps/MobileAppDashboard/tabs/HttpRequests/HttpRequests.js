/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  mobileAppIdUrlParameter,
  tagFiltersInDashboardUrlParameter,
  viewIdUrlParameter
} from 'in-mobile-apps/navigation/urlParameters';
import getMobileAppPaginatedBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppPaginatedBeaconGroups';
import { defaultGroupings, translateDemocratisationTagFiltersToFormModel } from 'in-mobile-apps/tags';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import { getLinkToHttpRequest, getLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { ms, number, percentage } from 'in-services/formatters/number';
import changeExplanation from 'in-mobile-apps/emptyListExplanation';
import useTagCatalog from 'in-mobile-apps/hooks/useTagCatalog';
import { isNotBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-mobile-apps:dashboard.tabs.originLabel'),
    getContent(item, { mobileAppId, viewId }) {
      let label = item.name;
      try {
        label = String(JSON.parse(label));
      } catch (e) {
        // ignore
      }

      return (
        <Link
          href$={getLinkToHttpRequest(mobileAppId, {
            httpRequestId: label,
            viewId
          })}
        >
          {label}
        </Link>
      );
    }
  },
  {
    id: 'beaconCountAgg',
    label: t('in-mobile-apps:dashboard.tabs.callsLabel'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.beaconCount}
          metric={item.metrics.beaconCountAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'beaconDurationAgg',
    label: t('in-mobile-apps:dashboard.tabs.latencyLabel'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.beaconDuration}
          metric={item.metrics.beaconDurationAgg}
          tooltipFormatter={ms.compact}
        />
      );
    }
  },
  {
    id: 'beaconErrorRateAgg',
    label: t('in-mobile-apps:dashboard.tabs.errorsLabel'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.beaconErrorRate}
          metric={item.metrics.beaconErrorRateAgg}
          tooltipFormatter={percentage.detailed}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: 'HTTP requests',
    changeExplanation
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    mobileAppIdUrlParameter,
    tagFiltersInDashboardUrlParameter,
    viewIdUrlParameter
  ],
  columnDefinitions,
  defaultOrderBy: 'beaconCountAgg',
  defaultOrderDirection: 'DESC',
  pathSegment: '/httpRequests'
});

export default function HttpRequests({ timeConfig, tagFilters, mobileAppId, mobileAppLabel }) {
  const tagCatalogHttpRequest = useTagCatalog('httpRequest');
  const rightHeader = (
    <Button
      kind="secondary"
      href$={
        tagCatalogHttpRequest &&
        getLinkToAnalyze({
          beaconType: 'httpRequest',
          formModel: translateDemocratisationTagFiltersToFormModel({
            mobileAppLabel,
            tagFilters,
            tagCatalog: tagCatalogHttpRequest
          }),
          groupBy: defaultGroupings.httpRequest
        })
      }
      style={{ marginRight: '0.5rem' }}
    >
      {t('in-mobile-apps:dashboard.tabs.analyzeHTTPRequestsBtn')}
    </Button>
  );

  tagFilters = tagFilters.concat({ name: 'mobileBeacon.type', operator: 'EQUALS', stringValue: 'httpRequest' });

  return (
    <Card>
      <ServerTableWithUrlState
        get={getTableData}
        mobileAppId={mobileAppId}
        tagFilters={tagFilters}
        timeConfig={timeConfig}
        rightHeader={rightHeader}
      />
    </Card>
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'beaconCountAgg',
  orderDirection = 'DESC',
  timeConfig,
  tagFilters
}) {
  if (isNotBlank(query)) {
    tagFilters = tagFilters.concat([{ name: 'mobileBeacon.http.origin', stringValue: query, operator: 'CONTAINS' }]);
  }

  return getMobileAppPaginatedBeaconGroups({
    tagFilters,
    timeConfig,
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    group: {
      groupbyTag: 'mobileBeacon.http.origin'
    },
    metrics: {
      beaconCountAgg: {
        metric: 'beaconCount',
        aggregation: 'SUM'
      },
      beaconCount: {
        metric: 'beaconCount',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      },
      beaconDurationAgg: {
        metric: 'beaconDuration',
        aggregation: 'MEAN'
      },
      beaconDuration: {
        metric: 'beaconDuration',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      },
      beaconErrorRateAgg: {
        metric: 'beaconErrorRate',
        aggregation: 'MEAN'
      },
      beaconErrorRate: {
        metric: 'beaconErrorRate',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      }
    }
  });
}
