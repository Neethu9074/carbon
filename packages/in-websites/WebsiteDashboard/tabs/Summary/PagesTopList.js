import React from 'react';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import { meanLatency, meanLatencyLargeInSeconds, number } from 'in-services/formatters/number';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import Link from 'in-components/Link';

const metrics = ['pageViews', 'onLoadTime', 'errors'];
const labels = ['Page Views', 'onLoad Time', 'Errors'];
const aggregations = ['SUM', 'MEAN', 'SUM'];
const formatters = [meanLatencyLargeInSeconds.compact, meanLatency.compact, number.compact];

export default function PagesTopList({ websiteId, timeConfig, tagFilters }) {
  return (
    <TopList
      title="Top Pages"
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
      timeConfig={timeConfig}
      tagFilters={tagFilters}
    />
  );
}

function getList({ tagFilters, timeConfig, selectedMetric, selectedMetricAggregation }) {
  return getWebsitePaginatedBeaconGroups({
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
      groupbyTag: 'beacon.page.name'
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
        tabPath: '/pages',
        tabParameters: {
          orderBy: `${selectedMetric}Agg`
        }
      })}
    >
      View all pages
    </Link>
  );
}

function Label({ item, websiteId }) {
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  return (
    <Link
      onClick={() => trackTopListNavigation()}
      href$={getLinkToWebsite(websiteId, {
        pageId: label,
        tabPath: '/summary'
      })}
    >
      {label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
