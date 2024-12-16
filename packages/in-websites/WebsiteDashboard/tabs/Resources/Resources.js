/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import invariant from 'invariant';

import { Link, Button } from '@instana/components';

import {
  pageIdUrlParameter,
  tagFiltersInDashboardUrlParameter,
  websiteIdUrlParameter
} from 'in-websites/navigation/urlParameters';
import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { defaultGroupings, translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import { resourcesTab, useLinkToAnalyze, useResourceLink } from 'in-websites/navigation/paths';
import { resourceType as resourceTypesMatrixParameter } from 'in-websites/navigation/matrix';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import Filters from 'in-websites/WebsiteDashboard/tabs/Resources/Filters';
import changeExplanation from 'in-websites/emptyListExplanation';
import useTagCatalog from 'in-websites/hooks/useTagCatalog';
import { ms, number } from 'in-services/formatters/number';
import { isNotBlank } from 'in-services/util/string';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

const ResourceNameContent = ({ item, websiteId, pageId }) => {
  let label = '';
  let linkParams = { pageId };
  try {
    label = String(JSON.parse(item.name));
    linkParams.resourceId = label;
  } catch (e) {
    if (__DEV__) invariant(item.name, 'Missing item name to use as resourceId for link generation');
  }

  const linkHref = useResourceLink(websiteId, linkParams);

  return <Link href={linkHref}>{label}</Link>;
};

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-websites:websiteDashboard.tabs.resources.resourcesLabelOrigin'),
    getContent: (item, { websiteId, pageId }) => (
      <ResourceNameContent item={item} websiteId={websiteId} pageId={pageId} />
    )
  },
  {
    id: 'beaconCountAgg',
    label: t('in-websites:websiteDashboard.tabs.resources.resourcesLabelResourceLoads'),
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
    label: t('in-websites:websiteDashboard.tabs.resources.resourcesLabelRetrievalTime'),
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
  }
];

const filterUrlParameter = {
  path: resourcesTab,
  name: resourceTypesMatrixParameter,
  as: 'resourceType',
  initialState: null
};

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    title: t('in-websites:websiteDashboard.noDataAvailable.resourcesTitle'),
    description: t('in-websites:websiteDashboard.noDataAvailable.resourcesDescription'),
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
  pathSegment: resourcesTab
});

const urlStateDefinition = {
  bind: [filterUrlParameter]
};

export default function Resources({ timeConfig, tagFilters, websiteId, resourceType, websiteLabel }) {
  const [urlState, setUrlState] = useUrlState(urlStateDefinition);
  const tagCatalogResourceLoad = useTagCatalog('resourceLoad');

  const analyzeHref = useLinkToAnalyze(
    tagCatalogResourceLoad && {
      beaconType: 'resourceLoad',
      formModel: translateDemocratisationTagFiltersToFormModel({
        websiteLabel,
        tagFilters,
        tagCatalog: tagCatalogResourceLoad
      }),
      groupBy: defaultGroupings.resourceLoad
    }
  );

  const resourcesListRightHeader = (
    <Fragment>
      <Button
        disabled={!analyzeHref}
        kind="secondary"
        href={analyzeHref}
        style={{ marginRight: '0.5rem' }}
        size="compact"
      >
        {t('in-websites:websiteDashboard.tabs.resources.resourcesButtonAnalyzeResources')}
      </Button>

      <Filters resourceType={resourceType} setFilter={setUrlState} {...urlState} />
    </Fragment>
  );

  tagFilters = tagFilters.concat({
    name: 'beacon.type',
    operator: 'EQUALS',
    stringValue: 'resourceLoad'
  });

  const tagFiltersForResourceList = isNotBlank(resourceType)
    ? tagFilters.concat([{ name: 'beacon.resourceType', stringValue: resourceType, operator: 'EQUALS' }])
    : tagFilters;

  return (
    <>
      <ServerTableWithUrlState
        get={getTableData}
        websiteId={websiteId}
        tagFilters={tagFiltersForResourceList}
        timeConfig={timeConfig}
        cardTitle={t('in-websites:websiteDashboard.tabs.indexLabelResources')}
        rightHeader={resourcesListRightHeader}
      />
    </>
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
      }
    }
  });
}
