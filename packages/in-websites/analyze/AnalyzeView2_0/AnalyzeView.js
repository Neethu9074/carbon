/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useLocation } from 'react-router';
import { get } from 'lodash';
import { t } from 'in-i18n';
import React from 'react';

import { isAnalyticsOneLocation } from 'in-websites/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/transformHelper';
import AnalyzeOneToTwoViewParameterConversion from 'in-websites/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion';
import { createTableTimestampColumnDefinition } from 'in-new-components/AnalyzeView/commonTableColumnDefinitions';
import { createListTimestampColumnDefinition } from 'in-new-components/AnalyzeView/commonListColumnDefinitions';
import FacetedFilterRangeInput from 'in-new-components/AnalyzeView/FacetedFilters/FacetedFilterRangeInput';
import { custom as customType, metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import FacetedFilterGeneric from 'in-new-components/AnalyzeView/FacetedFilters/FacetedFilterGeneric';
import { addDataSourceToBackendQueryModel } from 'in-websites/analyze/AnalyzeView2_0/util';
import GroupedBeacons from 'in-websites/analyze/AnalyzeView2_0/components/GroupedBeacons';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import { getSingleNumberMetricId } from 'in-new-components/AnalyzeView/metrics';
import StateManagement from 'in-new-components/AnalyzeView/StateManagement';
import Beacons from 'in-websites/analyze/AnalyzeView2_0/components/Beacons';
import { getMetricCatalog } from 'in-websites/api/metricCatalog';
import { analyzePath } from 'in-websites/navigation/paths';
import { beaconType } from 'in-websites/navigation/matrix';
import { getTagCatalog } from 'in-websites/api/tagCatalog';

const facetedSearchItems = [
  {
    renderer: FacetedFilterGeneric,
    title: t('in-websites:facetedSearch.website'),
    tag: 'beacon.website.name'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-websites:facetedSearch.page'),
    tag: 'beacon.page.name'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-websites:facetedSearch.browser'),
    tag: 'beacon.browser.name'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-websites:facetedSearch.os'),
    tag: 'beacon.os.name'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-websites:facetedSearch.country'),
    tag: 'beacon.geo.country'
  },
  {
    renderer: FacetedFilterGeneric,
    title: t('in-websites:facetedSearch.subdivision'),
    tag: 'beacon.geo.subdivision'
  },
  {
    renderer: FacetedFilterRangeInput,
    title: t('in-websites:facetedSearch.windowWidth'),
    tag: 'beacon.window.width'
  }
];

const groupedView = {
  defaultOrderBy: 'beaconCount_SUM',
  defaultOrderDirection: 'DESC',
  getOrderById: getOrderByGroupId,
  customFieldRenderingInstructions: {
    timestamp: createListTimestampColumnDefinition({
      getTimestamp: ({ item }) => item.earliestTimestamp
    })
  }
};

const ungroupedView = {
  defaultOrderBy: 'timestamp',
  defaultOrderDirection: 'DESC',
  getOrderById: getOrderById,
  customFieldRenderingInstructions: {
    timestamp: createTableTimestampColumnDefinition({
      getTimestamp: ({ beacon }) => beacon.timestamp
    })
  },
  metricFieldExtractors: {
    getColumnId({ metricDefinition }) {
      return metricDefinition.tagName;
    },
    getColumnLabel({ metricDefinition, tagCatalog }) {
      const tagLabel = tagCatalog?.tagsByName[metricDefinition.tagName]?.label;
      return tagLabel ?? metricDefinition.label;
    },
    getColumnFormatter({ metricDefinition }) {
      // Tag definitions in the tag catalog do not specify a formatter. For now we can use metric formatter.
      if (metricDefinition.formatter === 'PERCENTAGE') {
        // 'PERCENTAGE' formatter is currently used only for a calculated metric (beaconErrorRate),
        // which is based on a numeric tag.
        return 'NUMBER';
      }
      return metricDefinition.formatter;
    },
    getColumnValue({ metricDefinition, beacon }) {
      return metricDefinition.pathToValueInBeacon && get(beacon, metricDefinition.pathToValueInBeacon);
    },
    hasRawValue({ metricDefinition }) {
      return metricDefinition.pathToValueInBeacon != null;
    }
  }
};

const fixedFields = [
  { type: customType, customFieldId: 'timestamp' },
  { type: metricType, metricId: 'beaconCount', aggregationId: 'SUM' }
];

const defaultChartedMetrics = [{ metricId: 'beaconCount', aggregationId: 'SUM' }];

const dataSourceConfigurations = {
  pageLoad: {
    metricCatalogFilter: createMetricCatalogFilter('pageLoad'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [
      {
        type: 'metric',
        metricId: 'onLoadTime',
        aggregationId: 'MEAN'
      }
    ],
    defaultChartedMetrics
  },
  pageChange: {
    metricCatalogFilter: createMetricCatalogFilter('pageChange'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [
      {
        type: 'metric',
        metricId: 'uniqueUsersOrSessions',
        aggregationId: 'DISTINCT_COUNT'
      }
    ],
    defaultChartedMetrics
  },
  resourceLoad: {
    metricCatalogFilter: createMetricCatalogFilter('resourceLoad'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [
      {
        type: 'metric',
        metricId: 'beaconDuration',
        aggregationId: 'MEAN'
      }
    ],
    defaultChartedMetrics
  },
  httpRequest: {
    metricCatalogFilter: createMetricCatalogFilter('httpRequest'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [
      {
        type: 'metric',
        metricId: 'beaconDuration',
        aggregationId: 'MEAN'
      },
      {
        type: 'metric',
        metricId: 'beaconErrorRate',
        aggregationId: 'MEAN'
      }
    ],
    defaultChartedMetrics
  },
  error: {
    metricCatalogFilter: createMetricCatalogFilter('error'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [
      {
        type: 'metric',
        metricId: 'uniqueUsersOrSessions',
        aggregationId: 'DISTINCT_COUNT'
      }
    ],
    defaultChartedMetrics
  },
  custom: {
    metricCatalogFilter: createMetricCatalogFilter('custom'),
    facetedSearchItems,
    groupedView,
    ungroupedView,
    fixedFields,
    defaultSelectableFields: [
      {
        type: 'metric',
        metricId: 'uniqueUsersOrSessions',
        aggregationId: 'DISTINCT_COUNT'
      }
    ],
    defaultChartedMetrics
  }
};

const dataSourceParameter = {
  path: analyzePath,
  name: beaconType
};

export default function WebsiteAnalyzeView() {
  const location = useLocation();
  if (isAnalyticsOneLocation(location)) {
    return <AnalyzeOneToTwoViewParameterConversion dataSourceConfigurations={dataSourceConfigurations} />;
  }

  return (
    <StateManagement
      path={analyzePath}
      defaultDataSource="pageLoad"
      dataSourceParameter={dataSourceParameter}
      getTagCatalog={getTagCatalog}
      getMetricCatalog={getMetricCatalog}
      dataSourceConfigurations={dataSourceConfigurations}
    >
      {opts =>
        opts.isGrouped ? (
          <GroupedBeacons
            {...opts}
            getFacetedSearchSuggestions={getFacetedSearchSuggestions}
            useLastValidStateWhenErroneous
          />
        ) : (
          <Beacons {...opts} getFacetedSearchSuggestions={getFacetedSearchSuggestions} useLastValidStateWhenErroneous />
        )
      }
    </StateManagement>
  );
}

function createMetricCatalogFilter(dataSource) {
  return ({ beaconTypes }) => beaconTypes.includes(dataSource);
}

function getFacetedSearchSuggestions({
  timeConfig,
  backendQueryModel,
  backendQueryModelExcludingMissingGroupingTag,
  group,
  metricKey,
  dataSource
}) {
  return getWebsiteBeaconGroups({
    pagination: {
      retrievalSize: 200
    },
    timeConfig,
    tagFilterExpression: addDataSourceToBackendQueryModel({
      // Because the grouped view doesn't support a special 'Tag not present' group, faceted search
      // should filter out items which would belong to this group for consistency with the result list.
      backendQueryModel: backendQueryModelExcludingMissingGroupingTag ?? backendQueryModel,
      dataSource
    }),
    group,
    order: {
      by: metricKey,
      direction: 'DESC'
    },
    metrics: {
      [metricKey]: {
        metric: 'beaconCount',
        aggregation: 'SUM'
      }
    }
  });
}

function getOrderById({ metricCatalog, field }) {
  if (field.type === customType) {
    return field.customFieldId;
  }
  if (field.type === metricType) {
    const metricDefinition = metricCatalog?.find(({ metricId }) => metricId === field.metricId);
    return metricDefinition?.tagName;
  }
  return null;
}

function getOrderByGroupId({ field }) {
  if (field.type === customType) {
    return field.customFieldId === 'timestamp' ? 'earliestTimestamp' : field.customFieldId;
  }
  if (field.type === metricType) {
    return getSingleNumberMetricId(field);
  }
  return null;
}
