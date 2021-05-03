/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { compose } from 'recompose';

import { Button } from '@instana/components';
import { Card } from '@instana/components';
import { Link } from '@instana/components';

import {
  websiteIdUrlParameter,
  tagFiltersInDashboardUrlParameter,
  pageIdUrlParameter
} from 'in-websites/navigation/urlParameters';
import getWebsitePaginatedBeaconGroups from 'in-websites/subscriptions/getWebsitePaginatedBeaconGroups';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { defaultGroupings, translateDemocratisationTagFiltersToFormModel } from 'in-websites/tags';
import { resourcesTab, getLinkToResource, getLinkToAnalyze } from 'in-websites/navigation/paths';
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
import withUrlState from 'in-hoc/withUrlState';
import { t } from 'in-i18n';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-websites:websiteDashboard.tabs.resources.resourcesLabelOrigin'),
    getContent(item, { websiteId, pageId }) {
      let label = item.name;
      try {
        label = String(JSON.parse(label));
      } catch (e) {
        // ignore
      }

      return (
        <Link
          href$={getLinkToResource(websiteId, {
            resourceId: label,
            pageId
          })}
        >
          {label}
        </Link>
      );
    }
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
    entityName: 'resources',
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

export default compose(
  withUrlState({
    bind: [filterUrlParameter],
    reducerName: 'setFilter'
  })
)(Resources);

function Resources({ timeConfig, tagFilters, websiteId, resourceType, setFilter, websiteLabel }) {
  const tagCatalogResourceLoad = useTagCatalog('resourceLoad');
  const resourcesListRightHeader = (
    <Fragment>
      <Button
        kind="secondary"
        href$={
          tagCatalogResourceLoad &&
          getLinkToAnalyze({
            beaconType: 'resourceLoad',
            formModel: translateDemocratisationTagFiltersToFormModel({
              websiteLabel,
              tagFilters,
              tagCatalog: tagCatalogResourceLoad
            }),
            groupBy: defaultGroupings.resourceLoad
          })
        }
        style={{ marginRight: '0.5rem' }}
      >
        {t('in-websites:websiteDashboard.tabs.resources.resourcesButtonAnalyzeResources')}
      </Button>

      <Filters resourceType={resourceType} setFilter={setFilter} />
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
    <Card>
      <ServerTableWithUrlState
        get={getTableData}
        websiteId={websiteId}
        tagFilters={tagFiltersForResourceList}
        timeConfig={timeConfig}
        rightHeader={resourcesListRightHeader}
      />
    </Card>
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
