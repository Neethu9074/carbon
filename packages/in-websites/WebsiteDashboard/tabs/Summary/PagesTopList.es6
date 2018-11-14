import React from 'react';

import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import getWebsitePages from 'in-subscription/websiteMonitoring/getWebsitePages';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import { millis, number } from 'in-services/formatters/number';
import Link from 'in-components/Link';

const metrics = ['pageLoads', 'onLoadTime', 'errors'];
const labels = ['Page Loads', 'onLoad Time', 'Errors'];
const aggregations = ['SUM', 'MEAN', 'SUM'];
const formatters = [number.compact, millis.fixedCompact, number.compact];

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
  return getWebsitePages({
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

function ViewAll({ websiteId }) {
  return (
    <Link
      href$={getLinkToWebsite(websiteId, {
        tabPath: '/pages'
      })}
    >
      View All
    </Link>
  );
}

function Label({ item, websiteId }) {
  return (
    <Link
      onClick={() => trackTopListNavigation()}
      href$={getLinkToWebsite(websiteId, {
        pageId: item.pageName,
        tabPath: '/page'
      })}
    >
      {item.pageName}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
