/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Button } from '@instana/components';
import { Card } from '@instana/components';
import { Link } from '@instana/components';

import {
  websiteIdUrlParameter,
  tagFiltersInDashboardUrlParameter,
  pageIdUrlParameter
} from 'in-websites/navigation/urlParameters';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { defaultGroupings, translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import LearnMoreUserPointer from 'in-websites/WebsiteDashboard/components/LearnMoreUserPointer';
import { getSparkChartGranularity, getResolvedTimeConfig } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { getLinkToError, getLinkToAnalyze } from 'in-websites/navigation/paths';
import getWebsiteErrors from 'in-websites/subscriptions/getWebsiteErrors';
import changeExplanation from 'in-websites/emptyListExplanation';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

const columnDefinitions = [
  {
    id: 'errorMessage',
    label: t('in-websites:websiteDashboard.tabs.errors.errorsLabelErrorMessage'),
    getContent(item, { websiteId, pageId }) {
      return (
        <Link
          href$={getLinkToError(websiteId, {
            pageId,
            errorId: item.error.id
          })}
        >
          {item.error.message}
        </Link>
      );
    }
  },
  {
    id: 'errorsAgg',
    label: t('in-websites:websiteDashboard.tabs.errors.errorsLabelOccurrences'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="SUM"
          metrics={item.metrics.errors}
          metric={item.metrics.errorsAgg}
          tooltipFormatter={number.compact}
        />
      );
    }
  },
  {
    id: 'uniqueUsersOrSessionsAgg',
    label: t('in-websites:websiteDashboard.tabs.errors.errorsLabelAffectedUsers'),
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
          loading={result?.progress?.loading}
          rollup={getSparkChartGranularity(timeConfig)}
          timeConfig={getResolvedTimeConfig(timeConfig, result)}
          aggregation="DISTINCT_COUNT"
          metrics={item.metrics.uniqueUsersOrSessions}
          metric={item.metrics.uniqueUsersOrSessionsAgg}
          tooltipFormatter={affectedUsers.compact}
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-websites:websiteDashboard.noDataAvailable.javascriptErrorsTitle'),
    description: t('in-websites:websiteDashboard.noDataAvailable.javascriptErrorsDescription'),
    changeExplanation
  }),
  paginationResettingUrlParameters: [
    ...timeConfigUrlParameters,
    websiteIdUrlParameter,
    tagFiltersInDashboardUrlParameter,
    pageIdUrlParameter
  ],
  columnDefinitions,
  defaultOrderBy: 'errorsAgg',
  defaultOrderDirection: 'DESC',
  pathSegment: '/errors'
});

export default function Errors({ timeConfig, tagFilters, websiteId, websiteLabel }) {
  const tagCatalogError = useTagCatalog('error');
  const rightHeader = (
    <Button
      kind="secondary"
      href$={
        tagCatalogError &&
        getLinkToAnalyze({
          beaconType: 'error',
          formModel: translateDemocratisationTagFiltersToFormModel({
            websiteLabel,
            tagFilters,
            tagCatalog: tagCatalogError
          }),
          groupBy: defaultGroupings.error
        })
      }
      style={{ marginRight: '0.5rem' }}
    >
      {t('in-websites:websiteDashboard.tabs.errors.errorsButtonAnalyzeJSErrors')}
    </Button>
  );

  return (
    <Fragment>
      <LearnMoreUserPointer websiteId={websiteId} />
      <Card>
        <ServerTableWithUrlState
          get={getTableData}
          websiteId={websiteId}
          tagFilters={tagFilters}
          timeConfig={timeConfig}
          rightHeader={rightHeader}
        />
      </Card>
      <Footer />
    </Fragment>
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'errorsAgg',
  orderDirection = 'DESC',
  timeConfig,
  tagFilters
}) {
  if (isNotBlank(query)) {
    tagFilters = tagFilters.concat([{ name: 'beacon.error.message', stringValue: query, operator: 'CONTAINS' }]);
  }

  return getWebsiteErrors({
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
    metrics: {
      uniqueUsersOrSessionsAgg: {
        metric: 'uniqueUsersOrSessions',
        aggregation: 'DISTINCT_COUNT'
      },
      uniqueUsersOrSessions: {
        metric: 'uniqueUsersOrSessions',
        aggregation: 'DISTINCT_COUNT',
        granularity: getSparkChartGranularity(timeConfig)
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'SUM'
      },
      errors: {
        metric: 'errors',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      }
    }
  });
}
