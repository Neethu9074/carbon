import React, { Fragment } from 'react';

import getWebsitePaginatedBeaconGroups from 'in-subscription/websiteMonitoring/getWebsitePaginatedBeaconGroups';
import { defaultGroupings, translateDemocratisationTagFiltersToAnalyzeTagFilters } from 'in-websites/tags';
import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import { resourcesTab, getLinkToResource, getLinkToAnalyze } from 'in-websites/navigation/paths';
import { resourceType as resourceTypesMatrixParameter } from 'in-websites/navigation/matrix';
import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import Filters from 'in-websites/WebsiteDashboard/tabs/Resources/Filters';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { ms, number } from 'in-services/formatters/number';
import { Col, Row } from 'in-new-components/layout/Grid';
import { isNotBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import Link from 'in-components/Link';
import { compose } from 'recompose';

export default compose(
  withUrlDependingState({
    getPathSegment: () => resourcesTab,
    getMatrixPrefix: () => '',
    boundKeys: [resourceTypesMatrixParameter],
    getInitialState: () => ({ [resourceTypesMatrixParameter]: null }),
    reducerName: 'setFilter'
  })
)(Resources);

function Resources({
  timeConfig,
  tagFilters,
  websiteId,
  [resourceTypesMatrixParameter]: resourceType,
  setFilter,
  websiteLabel
}) {
  const resourcesListRightHeader = (
    <Fragment>
      <Button
        kind="secondary"
        href$={getLinkToAnalyze({
          beaconType: 'resourceLoad',
          tagFilters: translateDemocratisationTagFiltersToAnalyzeTagFilters({ websiteLabel, tagFilters }),
          group: defaultGroupings.resourceLoad
        })}
        style={{ marginRight: '0.5rem' }}
      >
        Analyze Resources
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
    <Fragment>
      <Row>
        <Col xs={12}>
          <ServerTableWithUrlBoundState
            pathSegment="/resources"
            matrixPrefix=""
            get={getTableData}
            websiteId={websiteId}
            tagFilters={tagFiltersForResourceList}
            timeConfig={timeConfig}
            columnDefinitions={columnDefinitions}
            rightHeader={resourcesListRightHeader}
            paginationResettingProps={['timeConfig', 'tagFilters']}
            defaultOrderBy="beaconCountAgg"
            defaultOrderDirection="DESC"
          />
        </Col>
      </Row>
    </Fragment>
  );
}

function getTableData({ page, pageSize, orderBy, orderDirection, timeConfig, query, tagFilters }) {
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

const columnDefinitions = [
  {
    id: 'name',
    label: 'Origin',
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
    label: 'Resource Loads',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
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
    label: 'Retrieval Time',
    defaultOrderDirection: 'DESC',
    getContent(item, { result, timeConfig }) {
      return (
        <SparkChart
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
