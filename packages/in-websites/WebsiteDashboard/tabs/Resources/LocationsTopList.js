/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import { TopListWithUrlState } from 'in-components/TopListWithUrlState';
import { useLinkToAnalyze } from 'in-websites/navigation/paths';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import { ms, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const metrics = ['beaconCount', 'beaconDuration'];
const labels = [
  t('in-websites:websiteDashboard.tabs.resources.locationsTopListLabelCalls'),
  t('in-websites:websiteDashboard.tabs.resources.locationsTopListLabelLoadTime')
];
const aggregations = ['SUM', 'MEAN'];
const formatters = [number.compact, ms.compact];

export default function LocationsTopList({ websiteId, websiteLabel, timeConfig, tagFilters, urlMatrixParamConfig }) {
  const tagCatalogResourceLoad = useTagCatalog('resourceLoad');
  return (
    <TopListWithUrlState
      title={t('in-websites:websiteDashboard.tabs.resources.locationsTopListTitle')}
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
      tagCatalogResourceLoad={tagCatalogResourceLoad}
      renderHistoricDataIndicator
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
      groupbyTag: 'beacon.http.path'
    },
    metrics: {
      [selectedMetric]: {
        metric: selectedMetric,
        aggregation: selectedMetricAggregation
      }
    }
  });
}

function ViewAll({ tagFilters, websiteLabel, tagCatalogResourceLoad, className }) {
  const analyzeHref = useLinkToAnalyze(
    tagCatalogResourceLoad && {
      formModel: translateDemocratisationTagFiltersToFormModel({
        websiteLabel,
        tagFilters,
        tagCatalog: tagCatalogResourceLoad
      }),
      beaconType: 'resourceLoad',
      groupBy: {
        groupbyTag: 'beacon.http.path'
      }
    }
  );
  return (
    <Link className={className} href={analyzeHref}>
      {t('in-websites:websiteDashboard.tabs.resources.locationsTopListLinkLabel')}
    </Link>
  );
}

function Label({ item, websiteLabel, tagFilters, tagCatalogResourceLoad }) {
  let label = item.name;
  try {
    label = String(JSON.parse(label));
  } catch (e) {
    // ignore
  }

  const analyzeHref = useLinkToAnalyze(
    tagCatalogResourceLoad && {
      formModel: translateDemocratisationTagFiltersToFormModel({
        websiteLabel,
        tagFilters: tagFilters.concat({ name: 'beacon.http.path', stringValue: label, operator: 'EQUALS' }),
        tagCatalog: tagCatalogResourceLoad
      }),
      beaconType: 'resourceLoad',
      groupBy: {}
    }
  );
  return <Link href={analyzeHref}>{label}</Link>;
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
