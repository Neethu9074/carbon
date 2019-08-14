import React from 'react';

import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import getWebsiteErrors from 'in-websites/subscriptions/getWebsiteErrors';
import { getLinkToWebsite, getLinkToError } from 'in-websites/navigation/paths';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

const metrics = ['errors', 'uniqueUsers'];
const labels = ['Occurrences', 'Affected Users'];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, affectedUsers.compact];

export default function ErrorsTopList({ websiteId, pageId, timeConfig, tagFilters }) {
  return (
    <TopList
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
