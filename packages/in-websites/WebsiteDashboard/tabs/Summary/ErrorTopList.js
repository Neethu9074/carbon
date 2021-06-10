/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { getLinkToWebsite, getLinkToError } from 'in-websites/navigation/paths';
import getWebsiteErrors from 'in-websites/subscriptions/getWebsiteErrors';
import { affectedUsers } from 'in-websites/formatters';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metrics = ['errors', 'uniqueUsersOrSessions'];
const labels = [
  t('in-websites:websiteDashboard.tabs.summary.errorTopListLabelOccurrences'),
  t('in-websites:websiteDashboard.tabs.summary.errorTopListLabelAffectedUsers')
];
const aggregations = ['SUM', 'DISTINCT_COUNT'];
const formatters = [number.compact, affectedUsers.compact];

export default function ErrorTopList({ websiteId, pageId, timeConfig, tagFilters, urlMatrixParamConfig }) {
  return (
    <TopListWithUrlState
      title={t('in-websites:websiteDashboard.tabs.summary.errorTopListTitleTopJSErrors')}
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      Renderer={TopListCardPresenter}
      ViewAll={ViewAll}
      Label={Label}
      Metric={Metric}
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

function ViewAll({ websiteId, selectedMetric, className }) {
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
      {t('in-websites:websiteDashboard.tabs.summary.errorTopListLinkLabelViewAllJSErrors')}
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
