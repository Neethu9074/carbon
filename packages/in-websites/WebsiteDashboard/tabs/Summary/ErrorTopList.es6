import React from 'react';

import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import getWebsiteErrors from 'in-subscription/websiteMonitoring/getWebsiteErrors';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import { number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

const metrics = ['errors', 'uniqueUsers'];
const labels = ['Occurrences', 'Affected Users'];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, number.compact];

export default function ErrorsTopList({ websiteId, pageId, timeConfig, tagFilters }) {
  return (
    <TopList
      title="Top Errors"
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

function ViewAll({ websiteId, selectedMetric }) {
  return (
    <Link
      href$={getLinkToWebsite(websiteId, {
        tabPath: '/errors',
        tabParameters: {
          orderBy: `${selectedMetric}Agg`
        }
      })}
    >
      View All
    </Link>
  );
}

function Label({ item, websiteId, pageId }) {
  return (
    <Link
      onClick={() => trackTopListNavigation()}
      href$={getLinkToWebsite(websiteId, {
        pageId,
        tabPath: '/error',
        tabParameters: {
          errorId: item.error.id
        }
      })}
    >
      {item.error.message}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
