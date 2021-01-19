/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { TopListWithUrlState, trackTopListNavigation } from 'in-new-components/TopListWithUrlState';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { getLinkToWebsite, getLinkToError } from 'in-websites/navigation/paths';
import getWebsiteErrors from 'in-websites/subscriptions/getWebsiteErrors';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

const metrics = ['errors', 'uniqueUsersOrSessions'];
const labels = ['Occurrences', 'Affected Users'];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, affectedUsers.compact];

export default function ErrorTopList({ websiteId, pageId, timeConfig, tagFilters, urlMatrixParamConfig }) {
  return (
    <TopListWithUrlState
      title="Top JS Errors"
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      render={TopListCardPresenter}
      renderViewAll={ViewAll}
      renderLabel={Label}
      renderMetric={Metric}
      websiteId={websiteId}
      pageId={pageId}
      timeConfig={timeConfig}
      tagFilters={tagFilters}
      urlMatrixParamConfig={urlMatrixParamConfig}
    />
  );
}

function getList({ tagFilters, timeConfig, selectedMetric, selectedMetricAggregation }) {
  return getWebsiteErrors({
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
    metrics: {
      [selectedMetric]: {
        metric: selectedMetric,
        aggregation: selectedMetricAggregation
      }
    }
  });
}

function ViewAll({ websiteId, selectedMetric }, className) {
  return (
    <Link
      className={className}
      href$={getLinkToWebsite(websiteId, {
        tabPath: '/errors',
        tabParameters: {
          orderBy: `${selectedMetric}Agg`
        }
      })}
    >
      View all JS errors
    </Link>
  );
}

function Label({ item, websiteId, pageId }) {
  return (
    <Link
      onClick={() => trackTopListNavigation()}
      href$={getLinkToError(websiteId, {
        pageId,
        errorId: item.error.id
      })}
    >
      {item.error.message}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
