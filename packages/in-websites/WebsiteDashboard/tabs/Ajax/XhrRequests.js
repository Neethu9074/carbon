/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';
import { Card } from '@instana/components';
import { Link } from '@instana/components';

import {
  websiteIdUrlParameter,
  tagFiltersInDashboardUrlParameter,
  pageIdUrlParameter
} from 'in-websites/navigation/urlParameters';
import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { defaultGroupings, translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { getLinkToXhrRequest, getLinkToAnalyze } from 'in-websites/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { ms, number, percentage } from 'in-services/formatters/number';
import changeExplanation from 'in-websites/emptyListExplanation';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestsLabelOrigin'),
    getContent(item, { websiteId, pageId }) {
      let label = item.name;
      try {
        label = String(JSON.parse(label));
      } catch (e) {
        // ignore
      }

      return (
        <Link
          href$={getLinkToXhrRequest(websiteId, {
            xhrId: label,
            pageId
          })}
        >
          {label}
        </Link>
      );
    }
  },
  {
    id: 'beaconCountAgg',
    label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestsLabelCalls'),
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
    label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestsLabelLatency'),
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
    id: 'errorRateAgg',
    label: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestsLabelErrors'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="MEAN"
          metrics={item.metrics.errorRate}
          metric={item.metrics.errorRateAgg}
          tooltipFormatter={percentage.detailed}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: t('in-websites:websiteDashboard.tabs.ajax.xhrRequestsEntityNameHTTPRequests'),
    changeExplanation
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    websiteIdUrlParameter,
    tagFiltersInDashboardUrlParameter,
    pageIdUrlParameter
  ],
  columnDefinitions,
  defaultOrderBy: 'beaconCountAgg',
  defaultOrderDirection: 'DESC',
  pathSegment: '/ajax'
});

export default function XhrRequests({ timeConfig, tagFilters, websiteId, websiteLabel }) {
  const tagCatalogHttpRequest = useTagCatalog('httpRequest');
  const rightHeader = (
    <Button
      kind="secondary"
      href$={
        tagCatalogHttpRequest &&
        getLinkToAnalyze({
          beaconType: 'httpRequest',
          formModel: translateDemocratisationTagFiltersToFormModel({
            websiteLabel,
            tagFilters,
            tagCatalog: tagCatalogHttpRequest
          }),
          groupBy: defaultGroupings.httpRequest
        })
      }
      style={{ marginRight: '0.5rem' }}
    >
      {t('in-websites:websiteDashboard.tabs.ajax.xhrRequestsButtonAnalyzeHTTPRequests')}
    </Button>
  );

  tagFilters = tagFilters.concat({ name: 'beacon.type', operator: 'EQUALS', stringValue: 'httpRequest' });

  return (
    <Card>
      <ServerTableWithUrlState
        get={getTableData}
        websiteId={websiteId}
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
    tagFilters = tagFilters.concat([{ name: 'beacon.http.origin', stringValue: query, operator: 'CONTAINS' }]);
  }

  return getWebsitePaginatedBeaconGroups({
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
      groupbyTag: 'beacon.http.origin'
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
      errorRateAgg: {
        metric: 'beaconErrorRate',
        aggregation: 'MEAN'
      },
      errorRate: {
        metric: 'beaconErrorRate',
        aggregation: 'MEAN',
        granularity: getSparkChartGranularity(timeConfig)
      }
    }
  });
}
