/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import { TopListWithUrlState, trackTopListNavigation } from 'in-components/TopListWithUrlState';
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import { ms, number, percentage } from 'in-services/formatters/number';
import { useLinkToAnalyze } from 'in-websites/navigation/paths';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import { t } from 'in-i18n';

const metrics = ['beaconCount', 'beaconDuration', 'beaconErrorRate'];
const labels = [
  t('in-websites:websiteDashboard.tabs.ajax.graphqlOperationsTopListLabelCalls'),
  t('in-websites:websiteDashboard.tabs.ajax.graphqlOperationsTopListLabelLatency'),
  t('in-websites:websiteDashboard.tabs.ajax.graphqlOperationsTopListLabelErrors')
];
const aggregations = ['SUM', 'MEAN', 'MEAN'];
const formatters = [number.compact, ms.compact, percentage.detailed];

export default function GraphqlOperationsTopList({
  websiteId,
  websiteLabel,
  timeConfig,
  tagFilters,
  urlMatrixParamConfig,
  renderHistoricDataIndicator
}) {
  const tagCatalogHttpRequest = useTagCatalog('httpRequest');
  return (
    <TopListWithUrlState
      title={t('in-websites:websiteDashboard.tabs.ajax.graphqlOperationsTopListTitle')}
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
      websiteLabel={websiteLabel}
      timeConfig={timeConfig}
      tagFilters={tagFilters}
      urlMatrixParamConfig={urlMatrixParamConfig}
      tagCatalogHttpRequest={tagCatalogHttpRequest}
      renderHistoricDataIndicator={renderHistoricDataIndicator}
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
      groupbyTag: 'beacon.graphql.operationName'
    },
    metrics: {
      [selectedMetric]: {
        metric: selectedMetric,
        aggregation: selectedMetricAggregation
      }
    }
  });
}

function ViewAll({ tagFilters, websiteLabel, tagCatalogHttpRequest, className }) {
  const analyzeHref = useLinkToAnalyze(
    tagCatalogHttpRequest && {
      formModel: translateDemocratisationTagFiltersToFormModel({
        websiteLabel,
        tagFilters,
        tagCatalog: tagCatalogHttpRequest
      }),
      beaconType: 'httpRequest',
      groupBy: {
        groupbyTag: 'beacon.graphql.operationName'
      }
    }
  );

  return (
    <Link className={className} href={analyzeHref}>
      View all GraphQL operation names
    </Link>
  );
}

function Label({ item, websiteLabel, tagFilters, tagCatalogHttpRequest }) {
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  const analyzeHref = useLinkToAnalyze(
    tagCatalogHttpRequest && {
      formModel: translateDemocratisationTagFiltersToFormModel({
        websiteLabel,
        tagFilters: tagFilters.concat({
          name: 'beacon.graphql.operationName',
          stringValue: label,
          operator: 'EQUALS'
        }),
        tagCatalog: tagCatalogHttpRequest
      }),
      beaconType: 'httpRequest',
      groupBy: {}
    }
  );

  return (
    <Link onClick={() => trackTopListNavigation()} href={analyzeHref}>
      {label}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
